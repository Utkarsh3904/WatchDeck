//it will repeat
import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"  
const router = Router()

console.log(registerUser);

router.route("/register").post( 

    upload.fields([         //middleware added
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount: 1

        }
    ]),
    registerUser 
)

export default router 