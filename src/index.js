import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({
path : './.env'
})

// ADD THESE DEBUG LINES
console.log("=== ENV CHECK ===");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
console.log("=== END ENV CHECK ===");


import connectDB from "./db/index.js"


connectDB()
.then (()=>{
    //app listens for if any error occured
    app.on("error", (error)=>{
        console.log("ERRR:", error);
        throw error
    })
    app.listen (process.env.PORT||8000 ,() => {
        console.log(`Server is running at ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("monogo DB connection failed", err);
})

