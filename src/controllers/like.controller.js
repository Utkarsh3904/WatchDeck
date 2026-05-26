import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }

    const deletedLike = await Like.findOneAndDelete({
        video: videoId, 
        likedBy: req.user._id
    })

    if(deletedLike){
        return res
            .status(200)
            .json(new ApiResponse(200, {isLiked: false}, "Video unliked successfully"))
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {isLiked: true, like}, "Video liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId")
    }

    const deletedLike = await Like.findOneAndDelete({
        comment: commentId, 
        likedBy: req.user._id
    })

    if(deletedLike){
        return res
            .status(200)
            .json(new ApiResponse(200, {isLiked: false}, "Comment unliked successfully"))
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {isLiked: true, like}, "Comment liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
       if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId")
    }

    const deletedLike = await Like.findOneAndDelete({
        tweet: tweetId, 
        likedBy: req.user._id
    })

    if(deletedLike){
        return res
            .status(200)
            .json(new ApiResponse(200, {isLiked: false}, "Tweet unliked successfully"))
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {isLiked: true, like}, "Tweet liked successfully"))
})


const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.user?._id,
        video: { $exists: true, $ne: null }
    })
    .sort({ createdAt: -1 })
    .populate("video")
    .lean()

    return res.status(200).json(
        new ApiResponse(200, likedVideos.map((like) => like.video), "Liked videos fetched successfully")
    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
