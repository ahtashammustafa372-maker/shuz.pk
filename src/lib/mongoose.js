import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://shuzpk:Coolsun%4023%2A%2B@ac-zrlnbk0-shard-00-00.qi167ew.mongodb.net:27017,ac-zrlnbk0-shard-00-01.qi167ew.mongodb.net:27017,ac-zrlnbk0-shard-00-02.qi167ew.mongodb.net:27017/jutay?ssl=true&replicaSet=atlas-38rbk7-shard-0&authSource=admin&retryWrites=true&w=majority";

if (!MONGODB_URI) {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Successfully connected to MongoDB");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
