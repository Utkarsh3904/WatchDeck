import mongoose from "mongoose"
import {DB_NAME} from '../constants.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected !! DB HOST:${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("Connection error FAILED !!", error);
        process.exit(1)         //process.exit() = zabardasti band , process.exitCode = politely band
    }
}

export default connectDB