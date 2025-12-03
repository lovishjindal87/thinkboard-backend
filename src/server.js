import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware

// CORS Configuration
const corsOptions = {
  credentials: true,
};

if(process.env.NODE_ENV !== "production"){
  corsOptions.origin = "http://localhost:5173";
} else if(process.env.FRONTEND_URL){
  corsOptions.origin = process.env.FRONTEND_URL;
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(ratelimiter);

// Middleware to ensure database connection on each request (for serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend for thinkboard is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Connect to database and start server (for local development)
if(process.env.NODE_ENV !== "production"){
  connectDB().then(() =>{
    app.listen(PORT, ()=> {
      console.log("Server listening on PORT:", PORT);
    });
  });
}

// Export app for Vercel serverless functions
export default app;



