import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const newPlaylist = await Playlist.create({
        name, 
        description,
        owner: req.user._id 
    })

    return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId in params")
    }

    const userPlaylist = await Playlist.find({
        owner : userId
    })
    .sort({createdAt: -1})
    .lean()

    return res.status(200)
    .json(new ApiResponse (200, userPlaylist, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlistId in params")
    }
    const getPlaylist = await Playlist.findById({
        _id: playlistId
    })
    .lean()

    if (!getPlaylist){
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, getPlaylist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlistId in params")
    }
    if (!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId in params")
    }       
    // TODO: add video to playlist
    const playlist = await Playlist.findById(
        playlistId
    )

    if (!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already exists in playlist")
    }
    //OR   const videoAlreadyExists = playlist.videos.some(
    //     (id) => id.toString() === videoId
    // );

    playlist.videos.push(videoId)
    await playlist.save()   

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos = playlist.videos.filter(
        (id) => id.toString() !== videoId
    );

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video removed from playlist successfully"
        )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlistId in params")
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }   
    return res.status(200)
    .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlistId in params")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {new: true}
    )
    if (!updatedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
