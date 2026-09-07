import { Pinecone } from "@pinecone-database/pinecone";

// Singleton implementation to prevent connection exhaustion in serverless environments
let pineconeInstance: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pineconeInstance) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable is missing.");
    }
    
    // Initialize the Pinecone client
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  
  return pineconeInstance;
};
