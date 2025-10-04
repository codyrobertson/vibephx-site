-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector index for fast similarity search
-- This uses ivfflat indexing for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS project_documents_embedding_idx
ON project_documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
