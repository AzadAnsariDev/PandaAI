import {Router} from 'express'
import {registerValidation} from '../validation/auth.validator.js'
import { getMe, login, register, resendEmail, verifyEmail } from '../controllers/auth.controller.js'
import { authUser } from '../middlewares/auth.middleware.js'


const authRouter = Router()

/*
 * @route POST /api/auth/register
    * @desc Register a user
    * @access Public
 */
authRouter.post("/register",registerValidation , register )


authRouter.get("/resendEmail", resendEmail)

/*
 * @route GET /api/auth/get
    * @desc Verify email after register
    * @access Public
 */
authRouter.get("/verifyEmail/:token", verifyEmail)

/*
 * @route POST /api/auth/login
    * @desc Login a user
    * @access Public
 */
authRouter.post("/login", login)

/*
 * @route GET /api/auth/getMe
    * @desc Get current user's information
    * @access Private   
 */
authRouter.get("/getMe", authUser, getMe)

export default authRouter