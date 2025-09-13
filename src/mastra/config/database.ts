import { PostgresStore, PgVector } from "@mastra/pg";

// Centralized database configuration to avoid duplicate connections
// This ensures we only create one PostgresStore and one PgVector instance
// that can be reused across all components (Mastra instance, memory, etc.)

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://localhost:5432/mastra_memory";

// Create a single PostgresStore instance for storage operations
export const postgresStore = new PostgresStore({
  connectionString: DATABASE_URL,
});

// Create a single PgVector instance for vector operations
export const pgVector = new PgVector({
  connectionString: DATABASE_URL,
});

// Export the connection string for any components that need it directly
export { DATABASE_URL };
