import moongoose , {Schema} from 'moongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


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


videoSchema.plugins(mongooseAggregatePaginate)  //plugin

export const Video = moongoose.model("Video", videoSchema)