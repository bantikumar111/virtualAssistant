import express from "express"
import dotenv from "dotenv"
dotenv.config() //use dotenv ,we can access everything from .env file
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"


const app= express()

app.use(cors({
  origin:"https://virtualassistant-frontend-upq7.onrender.com",  //allow this url , whoever will come from this url  we'll allow 
  credentials:true
}
))
const port=process.env.PORT || 5000


app.use(express.json()) //store chunk
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(port, ()=>{
  connectDb();
console.log(`server started on http://localhost:${port}`);
})
