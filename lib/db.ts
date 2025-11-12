import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  console.warn("[lib/db] Missing MONGODB_URI env var")
}

let cached = (global as any)._mongoose
if (!cached) {
  cached = (global as any)._mongoose = { conn: null as any, promise: null as any }
}

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        autoIndex: true,
      })
      .then((m) => m)
      .catch((err) => {
        console.error("[lib/db] Mongo connect error:", err)
        console.error("[lib/db] Hint: check your MONGODB_URI, network/DNS, and whether mongodb+srv DNS lookups are allowed from this environment.")
        const e: any = new Error('MongoDB connection failed')
        e.original = err
        e.isDbConnectionError = true
        throw e
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}
