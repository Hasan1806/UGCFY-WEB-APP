import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { PromptTemplate } from "@langchain/core/prompts";
import { getVectorStoreClient } from "@/lib/supabase/admin";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { AI_MODELS } from "@/lib/ai/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPLATE = `You are UGCFY's expert AI assistant. Use the following pieces of retrieved context to answer the user's question. 
If the answer is not in the context, say 'I cannot find the answer in the provided documentation.' Do not hallucinate.

Context:
{context}

Current conversation:
{chat_history}

User: {question}
AI:`;

// STRICT RAG INPUT SCHEMA
const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "data", "function", "tool"]),
      content: z.string().optional(),
      parts: z.array(z.any()).optional(),
      id: z.string().optional(),
      createdAt: z.any().optional(),
    })
  ).min(1, "At least one message is required"),
});

// STRICT ERROR RESPONSE SCHEMA
const ChatErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  status: z.number(),
  timestamp: z.number(),
  issues: z.any().optional()
});

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Request Validation
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload", status: 400, timestamp: Date.now() }, { status: 400 });
    }

    console.info({ event: "RAW_LLM_REQUEST", payload: JSON.stringify(rawBody).substring(0, 500) });

    const validationResult = ChatRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.warn({ event: "SCHEMA_VALIDATION_FAILED", issues: validationResult.error.issues });
      const errorPayload = ChatErrorResponseSchema.parse({
        success: false, 
        error: "Schema validation failed", 
        issues: validationResult.error.issues,
        status: 400, 
        timestamp: Date.now()
      });
      return NextResponse.json(errorPayload, { status: 400 });
    }

    console.info({ event: "PARSED_REQUEST", data: JSON.stringify(validationResult.data).substring(0, 500) });

    const { messages } = validationResult.data;

    // Normalize messages to extract text from parts if content is missing
    const normalizedMessages = messages.map(m => {
      let text = m.content || "";
      if (!text && m.parts) {
        text = m.parts
          .filter(p => p.type === "text" || !p.type)
          .map(p => p.text || "")
          .join("\n");
      }
      return { ...m, content: text };
    });

    const currentMessageContent = normalizedMessages[normalizedMessages.length - 1]?.content || "";
    const previousMessages = normalizedMessages.slice(0, -1).map((m) => `${m.role}: ${m.content}`).join("\n");

    const supabaseClient = getVectorStoreClient();

    const vectorStore = new SupabaseVectorStore(
      new GoogleGenerativeAIEmbeddings({ 
        model: AI_MODELS.EMBEDDING,
        apiKey: process.env.GEMINI_API_KEY || ""
      }),
      {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
      }
    );

    const retriever = vectorStore.asRetriever({ k: 4 });
    
    let contextText = "";
    const retrievalStartTime = Date.now();
    try {
      // 2. Perform Vector Search with 1500ms Timeout to guarantee fast response
      const docs = await Promise.race([
        retriever.invoke(currentMessageContent),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Retrieval Timeout")), 1500))
      ]);
      
      contextText = docs.map((doc) => doc.pageContent).join("\n\n");
      const latency = Date.now() - retrievalStartTime;

      if (!contextText.trim()) {
        console.info({ event: "RAGFallbackActivated", reason: "Empty Retrieval", latency });
        contextText = "No explicit knowledge base context found. Using generalized assistant capabilities to help the user.";
      } else {
        console.info({ event: "RAGSuccess", contextLength: contextText.length, latency });
      }

    } catch (error) {
      const latency = Date.now() - retrievalStartTime;
      console.warn({ 
        event: "VectorSearchFailed", 
        error: error instanceof Error ? error.message : "Unknown Error", 
        latency 
      });
      console.info({ event: "RAGFallbackActivated", reason: "Exception or Timeout", latency });
      
      // 3. Fallback Context - DO NOT CRASH
      contextText = "Knowledge base temporarily unavailable. Provide a generalized assistant response.";
    }

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatGoogleGenerativeAI({
      model: AI_MODELS.CHAT,
      temperature: 0.2,
      streaming: true,
      apiKey: process.env.GEMINI_API_KEY || ""
    });

    const parser = new StringOutputParser();

    const chain = RunnableSequence.from([prompt, model, parser]);

    const stream = await chain.stream({
      chat_history: previousMessages,
      context: contextText,
      question: currentMessageContent,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk !== undefined && chunk !== null) {
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.close();
        } catch (e) {
          console.error("[STREAM ERROR]", e);
          controller.error(e);
        }
      }
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: unknown) {
    // 2. Structured Error Logging
    console.error({
      event: "RAG_PIPELINE_ERROR",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown Error",
      stack: error instanceof Error ? error.stack : undefined
    });

    // 3. Safe Failure Response (No Stack Traces)
    const errorPayload = ChatErrorResponseSchema.parse({
      success: false, 
      error: "Internal Server Error during AI processing", 
      status: 500, 
      timestamp: Date.now()
    });
    return NextResponse.json(errorPayload, { status: 500 });
  }
}
