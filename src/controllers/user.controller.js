import  asyncHandler  from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registerUser = asyncHandler( async (req,res) => {

    // Steps to follow to register the user : 
    // get user details from frontend
    // vaildation -not empty
    // check if user already exists : username.email 
    // check for imahes, check for avatar
    // create user object - create entry in db 
    // remove password and refresh token field from response 
    // check for user creation 
    // return res

    const {fullname, email, password, username } = req.body //extract data from req.body
    // console.log("email:" , email);


    // A chk to see sari fields present or not , some ye krega agr koi bhi field khali hoga tho ye true return krdega
    if([fullname, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(409, "All fields are required")
    }
    //A chk to see is the user already existed
    const existedUser =  await User.findOne({
        $or: [{ username }, { email }]   //$or , $and etc. are operators
    }) 
    //If it existed throw error
    if( existedUser ){
        throw new ApiError (409, "User with email or username allready exists")
    }
    
    //multer gives req.files
     //we take [0] as it is first property of avatar from that we can get its path jo multer ne upload kiya hai.
     //instead ofthis we can get many more like .size .png etc n we can apply validations on the basis of thesess.
     //avatar word here bcoz of "avatar" word in multer files

     //this code is written by sir prev now 
    // const avatarLocalPath = req.files?.avatar[0]?.path;  
    // const coverImageLocalPath = req.files.coverImage[0].path
        const avatarLocalPath = req.files?.avatar?.[0]?.path;

        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

    if( !avatarLocalPath ){ 
        throw new ApiError (400, "Avatar file is required" )
    }

    //upload on cloudinary
    const avatar = await uploadOnCloudinary ( avatarLocalPath )
    const coverImage = await uploadOnCloudinary ( coverImageLocalPath )

    if( !avatar ){
        throw new ApiError (400, "Avatar upload on cloudinary failed" )
    }

    //DB me user creation
    const user = await User.create({
        fullname , 
        avatar : avatar.url,  //form cloudinary it gets
        coverImage : coverImage?.url || "", //this is bcoz this is not compulsory agr nhi bhi aaya tho chalega
        email,
        password,
        username : username.toLowerCase()
    })

    // ye vo hai jo humuser ko denge tho user ko password aur refreshtoken dene ki need nhi hai thi dene se phle hta denge
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if( !createdUser ) {
        throw new ApiError( 500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully ")
    )
})

export {registerUser}