import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id

    if (!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId")
    }

    // NOTE: Update these field names if your schemas use different keys.
    const totalVideos = await Video.countDocuments({ owner: userId })
    const totalSubscribers = await Subscription.countDocuments({ channel: userId })
    const totalLikes = await Like.countDocuments({ likedBy: userId })
    const totalVideoViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])

    return res.status(200).json(new ApiResponse(200, {
        totalVideoViews: totalVideoViews[0]?.totalViews || 0,
        totalSubscribers,
        totalVideos,
        totalLikes
    }, "Channel stats fetched successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video
    .find({ owner: req.user?._id })
    .sort({ createdAt: -1 })
    .lean()

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
