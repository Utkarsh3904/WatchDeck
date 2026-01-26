import dotenv from "dotenv"

dotenv.config({

})


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

