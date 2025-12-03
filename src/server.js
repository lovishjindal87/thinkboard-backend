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

if(process.env.NODE_ENV !== "production"){
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}



app.use(express.json());
app.use(cookieParser());
app.use(ratelimiter);


app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() =>{
        app.listen(PORT, ()=> {
        console.log("Server listening on PORT:", PORT);
    });
});


