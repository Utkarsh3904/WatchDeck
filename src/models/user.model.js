import moongoose , {Schema} from 'moongoose'
import jwt from "jsonwebtokens"
import bcrypt from "bcrypt"

const videoSchema = new Schema(
    {
        videoFile : {
            type: String,   //cloudinary URL
            required: true,
        },
        thumbnail : {
            type: String,   //cloudinary URL
            required: true,
        },
        title : {
            type: String,   
            required: true,
        },
        description : {
            type: String,   
            required: true,
        },
        duration : {
            type: Number,    //Cloudinary URL (when data is stored it stores the time)
            default : 0   
            },
        views : {
            type: Number,
            required : true,
        },
        isPublished : {
            type: Boolean,
            default : true
        },
        owner : {
            type: Schema.Types.ObjectId,
            ref: "User"
        }


    },{ timestamps : true }
)

userSchema.pre("save" , async function(next) {
    //if there is no change in password field skip
    if(!this.isModified("password") ) return next();
    //else if there is changes in pass encrypt again
    this.password = bcrypt.hash(this.password, 10)  //10 is number of rounds it wither be 8 or like default
    next()
})

//custom method : to chk/match that the stored pass is equal to the pass given by user in like login etc

userSchema.methods.isPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            id: this._id,  //we get this id form mongoDB
            email: this.email,
            username: this.username,
            fullName: this.fullname
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

export const Video = moongoose.model("Video", videoSchema)