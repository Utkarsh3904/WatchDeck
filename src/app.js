import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" //user ki cookies ko access n set krpau iss se


const app=express()

// using use is for middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN, //for production , extra 
    credentials:true
}))
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit :"16kb"}))
app.use(express.static("public"))//public assets/folder that stores photos etc in local server
app.use(cookieParser())

//import routes
import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/users", userRouter);

export {app}