import express from 'express'
import { getMe, loginUser, registerUser, verifyEmail } from '../controllers/auth.controller.js'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { authUser } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post('/register',registerValidator,registerUser)


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login",loginValidator,loginUser)


/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me",authUser,getMe)


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email",verifyEmail)

export default authRouter