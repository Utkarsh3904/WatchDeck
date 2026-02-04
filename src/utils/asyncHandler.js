
const asyncHandler = (requestHandler)=>{
    return async (req, res, next)=>{
        try {
            return await Promise.resolve(requestHandler(req, res, next))
        } catch (err) {
            return next(err)
        }
    }
}


export default asyncHandler


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