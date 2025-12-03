import mongoose from "mongoose"

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    try {
        // Reuse existing connection if available (for serverless)
        if (cached.conn) {
            return cached.conn;
        }
        
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            };
            
            cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
                .then((mongoose) => {
                    console.log("MongoDB Connected Successfully");
                    return mongoose;
                });
        }
        
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error("Error while connecting to MongoDB", error);
        // Don't exit process in production (serverless)
        if (process.env.NODE_ENV !== "production") {
            process.exit(1);
        }
        throw error;
    }
}