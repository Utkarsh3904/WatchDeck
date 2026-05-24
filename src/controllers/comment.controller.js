    import mongoose from "mongoose"
    import {Comment} from "../models/comment.model.js"
    import {ApiError} from "../utils/ApiError.js"
    import {ApiResponse} from "../utils/ApiResponse.js"
    import {asyncHandler} from "../utils/asyncHandler.js"

    const getVideoComments = asyncHandler(async (req, res) => {
        const {videoId} = req.params
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100)
        const skip = (page - 1) * limit

        if (!mongoose.isValidObjectId(videoId)){
            throw new ApiError(400, "Invalid videoId in params")
        }

        const query = {video: videoId}

        const [totalComments, comments] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .lean()
        ])

        res.status(200).json(new ApiResponse(200, {
            comments,
            pagination: {
                totalItems: totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: page,  
                pageSize: limit
            }
        }, "Comments fetched successfully"))
    })

    const addComment = asyncHandler(async (req, res) => {
        // TODO: add a comment to a video
        const {videoId} = req.params
        const {content} = req.body
        const {userId} = req.user

        if (!mongoose.isValidObjectId(videoId)){
            throw new ApiError(400, "Invalid videoId in params")
        }

        if (!content){
            throw new ApiError(400, "Content is required")
        }
        const newComment = await Comment.create({
            video: videoId,
            user: userId,
            content
        })
        return res.status( 200 ).json(
            new ApiResponse (200 , newComment , "Comment added successfully")
        )
    })

    const updateComment = asyncHandler(async (req, res) => {
        // TODO: update a comment
        const {commentId} = req.params
        const {content} = req.body

        if(!content){
            throw new ApiError(400, "New comment is required to update comment")
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set:{
                    content: content
                }
            },{
                new: true
            }
        )

            if (!updatedComment){
                throw new ApiError(404, "Comment not found")
            }
            return res.status(200).json(
                new ApiResponse (200, updatedComment, "Comment updated successfully")
            )
    })

    const deleteComment = asyncHandler(async (req, res) => {
        // TODO: delete a comment
        const {commentId} = req.params

        // it takes object 
        const commentcontext = await Comment.findOneAndDelete({ 
            _id: commentId })

        // Missing check: deleted comment may be null if not found.
        if (!commentcontext) {
            throw new ApiError(404, "Comment not found")
        }

        return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"))
    })

    export {
        getVideoComments, 
        addComment, 
        updateComment,
        deleteComment
        }
