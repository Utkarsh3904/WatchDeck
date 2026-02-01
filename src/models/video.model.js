import moongoose , {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const userSchema = new Schema(
    {
        username: {
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

videoSchema.plugins(mongooseAggregatePaginate)  //plugin

export const User = moongoose.model( "User" , userSchema)