import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { getVectorStoreClient } from '../src/lib/supabase/admin';
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  try {
    if (!process.env.GEMINI_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables for Google Gen AI or Supabase.");
    }

    console.log("Loading documents from /docs...");
    
    // 1. Load documents natively via FS
    const docsDir = path.resolve(process.cwd(), "docs");
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);
    
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".txt") || f.endsWith(".md"));
    const docs = files.map(file => ({
      pageContent: fs.readFileSync(path.join(docsDir, file), "utf-8"),
      metadata: { source: file }
    }));

    console.log(`Loaded ${docs.length} documents.`);

    // 2. Split documents into optimal chunks for RAG
    console.log("Chunking documents...");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    // Create actual LangChain documents
    const chunkedDocs = await textSplitter.createDocuments(
      docs.map(d => d.pageContent),
      docs.map(d => d.metadata)
    );
    console.log(`Split into ${chunkedDocs.length} chunks.`);

    // 3. Initialize Google Embeddings
    console.log("Initializing Google Embeddings...");
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      apiKey: process.env.GEMINI_API_KEY,
    });
    
    const supabaseClient = getVectorStoreClient();

    // 4. Upsert vectors to Supabase
    console.log("Ingesting to Supabase pgvector... This may take a moment.");
    await SupabaseVectorStore.fromDocuments(chunkedDocs, embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });

    console.log("✅ Successfully ingested to Supabase.");
  } catch (error) {
    console.error("❌ Failed to ingest data:", error);
    process.exit(1);
  }
}

run();
