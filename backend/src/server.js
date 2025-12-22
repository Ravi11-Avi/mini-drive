import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";



import connectDB from "./config/db.js";
import authRoutes from "./route/auth.js";
import fileRouter from "./route/file.js"
import "./config/passport-github.js"
import "./config/passport-google.js"


import oauthRoutes from "./route/auth-oauth.js";



dotenv.config();

connectDB();

const app =  express();



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mini-drive-phi.vercel.app",
      "https://mini-drive-gpg9ti40t-ravis-projects-cc701dee.vercel.app",
      "https://mini-drive-git-main-ravis-projects-cc701dee.vercel.app",
      
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// app.options("/*", cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

app.use("/api/auth", oauthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRouter);


app.get("/",(req,res)=>{
    res.send("API running ");
});

const PORT  =  process.env.PORT || 5000 ; 
app.listen(PORT, ()=>console.log(`Server Running on thr fort ${PORT}`));

