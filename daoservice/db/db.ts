import mongoose, { Mongoose } from "mongoose";

// Extend global type for TypeScript
declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

// Cache the connection to prevent multiple connections
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable");
        }

        // If already connected, return the existing connection
        if (cached.conn) {
            return cached.conn;
        }

        // If connection is in progress, wait for it
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            };

            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
                console.log("MongoDB connected successfully");
                return mongooseInstance;
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB connection error:", error);
        throw error;
    }
}