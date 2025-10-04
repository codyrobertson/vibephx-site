export interface DatabaseProvider {
  id: string
  label: string
  logo: string
  description: string
}

export const databaseProviders: DatabaseProvider[] = [
  { id: 'neon', label: 'Neon', logo: 'neon.tech', description: 'Serverless Postgres' },
  { id: 'supabase', label: 'Supabase', logo: 'supabase.com', description: 'Open source Firebase' },
  { id: 'planetscale', label: 'PlanetScale', logo: 'planetscale.com', description: 'Serverless MySQL' },
  { id: 'turso', label: 'Turso', logo: 'turso.tech', description: 'SQLite edge DB' },
  { id: 'mongodb', label: 'MongoDB Atlas', logo: 'mongodb.com', description: 'NoSQL cloud' },
  { id: 'firebase', label: 'Firebase', logo: 'firebase.google.com', description: 'Google BaaS' },
  { id: 'replitdb', label: 'Replit DB', logo: 'replit.com', description: 'Simple key-value' },
  { id: 'upstash', label: 'Upstash', logo: 'upstash.com', description: 'Redis + Kafka' },
  { id: 'xata', label: 'Xata', logo: 'xata.io', description: 'Serverless Postgres' },
  { id: 'cockroach', label: 'CockroachDB', logo: 'cockroachlabs.com', description: 'Distributed SQL' },
  { id: 'fauna', label: 'Fauna', logo: 'fauna.com', description: 'Distributed document DB' },
  { id: 'dynamodb', label: 'DynamoDB', logo: 'aws.amazon.com', description: 'AWS NoSQL' },
  { id: 'redis_cloud', label: 'Redis Cloud', logo: 'redis.io', description: 'Managed Redis' },
  { id: 'postgres', label: 'PostgreSQL', logo: 'postgresql.org', description: 'Self-hosted SQL' },
  { id: 'mysql', label: 'MySQL', logo: 'mysql.com', description: 'Self-hosted SQL' },
  { id: 'airtable', label: 'Airtable', logo: 'airtable.com', description: 'Spreadsheet DB' },
  { id: 'convex', label: 'Convex', logo: 'convex.dev', description: 'Reactive backend' },
  { id: 'pocketbase', label: 'PocketBase', logo: 'pocketbase.io', description: 'SQLite BaaS' },
  { id: 'hasura', label: 'Hasura', logo: 'hasura.io', description: 'GraphQL engine' },
  { id: 'railway_db', label: 'Railway DB', logo: 'railway.app', description: 'Postgres hosting' },
  { id: 'cassandra', label: 'Cassandra', logo: 'cassandra.apache.org', description: 'Wide-column store' },
  { id: 'timescale', label: 'Timescale', logo: 'timescale.com', description: 'Time-series DB' },
  { id: 'clickhouse', label: 'ClickHouse', logo: 'clickhouse.com', description: 'Analytics DB' },
  { id: 'edgedb', label: 'EdgeDB', logo: 'edgedb.com', description: 'Graph-relational DB' },
  { id: 'surrealdb', label: 'SurrealDB', logo: 'surrealdb.com', description: 'Multi-model DB' }
]
