import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { TokenLimiter } from "@mastra/memory/processors";
import { postgresStore, pgVector } from "../config/database";

// Enhanced Memory Configuration for Travel Agent
const memory = new Memory({
  processors: [
    // ref: https://mastra.ai/en/docs/memory/memory-processors
    // Example 1: Remove all tool calls/results
    // new ToolCallFilter(),

    // always place this last
    new TokenLimiter(120000), // limit to 120k tokens
  ],
  storage: postgresStore, // Use centralized PostgresStore instance
  vector: pgVector, // Use centralized PgVector instance
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    // Enable semantic search to find relevant past conversations
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
      scope: "resource", // Search across all threads for this user
    },
    // Enable working memory to remember user information
    workingMemory: {
      enabled: true,
      scope: "resource", // Memory persists across all user threads
      // schema: userProfileSchema, // can only specify schema or template
      // ref: https://mastra.ai/en/docs/memory/working-memory#example-multi-step-retention
      template: `
        # USER PROFILE
  
        ## PERSONAL INFO
        - name:
        - location:
  
        ## PREFERENCES
        - travel preferences:
        - accommodation preferences:
        - conversation style:
  
        ## INTERESTS
        - likes:
        - dislikes:
  
        --- After user says "My name is **Sam** and I'm from **Berlin**" ---
        # USER PROFILE
  
        ## PERSONAL INFO
        - name: Sam
        - location: Berlin
  
        ## PREFERENCES
        - travel preferences:
        - accommodation preferences:
        - conversation style:
  
        ## INTERESTS
        - likes:
        - dislikes:
  
        --- After user says "I like **street food** and I don't like **pizza**" ---
        # USER PROFILE
  
        ## PERSONAL INFO
        - name: Sam
        - location: Berlin
  
        ## PREFERENCES
        - travel preferences:
        - accommodation preferences:
        - conversation style:
  
        ## INTERESTS
        - likes: street food
        - dislikes: pizza
        `,
    },
    threads: {
      generateTitle: {
        model: openai("gpt-4.1-nano"),
        instructions:
          "Generate a concise title for this conversation based on the first user message.",
      },
    },
  },
});

export { memory };
