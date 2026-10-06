import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            });
        }

        const user = await userModel.create({ username, email, password });

        let emailSent = false;
        try {
            const emailVerificationToken = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            const appBaseUrl = (process.env.APP_URL || "").replace(/\/+$/, "");

            await sendEmail({
                to: email,
                subject: "Welcome to Aetherity!",
                html: `
                    <p>Hi ${username},</p>
                    <p>Thank you for registering at <strong>Aetherity</strong>. We're excited to have you on board!</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="${appBaseUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Best regards,<br>The Aetherity Team</p>
                `
            });
            emailSent = true;
        } catch (mailError) {
            console.warn("Email verification could not be sent. Enabling normal authentication fallback:", mailError.message);
            // Parallel fallback: auto-verify user so normal authentication works immediately
            user.verified = true;
            await user.save();
        }

        // Issue authentication cookie if email verification was bypassed/failed
        const isProd = process.env.NODE_ENV === "production" || !!process.env.RENDER;
        if (!emailSent) {
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }

        return res.status(201).json({
            message: emailSent
                ? "User registered successfully. Please check your email to verify."
                : "User registered successfully. Email service unavailable, normal authentication activated.",
            success: true,
            emailSent,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });
    } catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({
            message: err.message || "Registration failed",
            success: false
        });
    }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
                err: "User not found"
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
                err: "Incorrect password"
            });
        }

        // Normal authentication parallel with email verification:
        // If password is valid, auto-verify user so email verification issues don't lock them out
        if (!user.verified) {
            user.verified = true;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProd = process.env.NODE_ENV === "production" || !!process.env.RENDER;
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login Successful",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.status(500).json({
            message: err.message || "Login failed",
            success: false
        });
    }
}

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Failed to fetch user",
            success: false
        });
    }
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false,
                err: "User not found"
            });
        }

        user.verified = true;
        await user.save();

        const appBaseUrl = (process.env.APP_URL || "").replace(/\/+$/, "");
        const html = `
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now log in to your account.</p>
            <a href="${appBaseUrl}/login">Go to Login</a>
        `;

        return res.send(html);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid token or expired",
            success: false,
            err: error.message
        });
    }
}

export const logoutUser = (req, res) => {
    const isProd = process.env.NODE_ENV === "production" || !!process.env.RENDER;
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
