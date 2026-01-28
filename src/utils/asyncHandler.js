
const asyncHandler = (requestHandler)=>{
    (req, res, next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch ((err)=>next(err))
    }
}
 export {asyncHandler}
 

 //asyncHandler is a higher order fn so it take fn as input also
 //const asyncHandler = (func) => async {() => {...}}

//  const asyncHandler = (fn) => async (req , res , next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
//  }