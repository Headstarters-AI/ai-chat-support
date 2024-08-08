import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB and cache the connection for reuse
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }; // Return cached connection if it exists
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db }; // Return the database connection
}
