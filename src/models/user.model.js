import mongoose , {Schema} from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required : true,
            unique : true,
            lowercase :true,
            trim : true,
            index: true    //for to enable search on basis on this (optimizes search)
        },
        email: {
            type: String,
            required : true,
            unique : true,
            lowercase :true,
            trim : true,
        },
        username: {
            type: String,
            required : true,
            trim : true,
            index: true    //for to enable search on basis on this (optimizes search)
        },
        avatar:{
            type: String,     //cloudinary URL
            required: true,
        },
        coverImage :{
            type: String,
        },
        watchHistory : [   //array
            {
                type: Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password :{
            type : String,
            required: [true, 'Passwrd is required']   //just a message 
        },
        refreshToken: {
            type : String
        }
    },
    { timestamps : true }
)

userSchema.pre("save" , async function(next) {
    //if there is no change in password field skip
    if(!this.isModified("password") ) return next();
    //else if there is changes in pass encrypt again
    this.password = await bcrypt.hash(this.password, 10)  //10 is number of rounds it wither be 8 or like default
    // next()
})

//custom method : to chk/match that the stored pass is equal to the pass given by user in like login etc

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            id: this._id,  //we get this id form mongoDB
            email: this.email,
            username: this.username,
            fullname: this.fullname
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
         }
    )
}

userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            id: this._id,  //we get this id from mongoDB
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
         }
    )
}

export const User = mongoose.model("User", userSchema)
