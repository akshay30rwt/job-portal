const express = require('express');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    getProfile
} = require('../controllers/authController');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validators/authValidator');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user, hashes the password, generates an email verification token valid for 24 hours, and sends a verification email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully. A verification email has been sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error or email already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already registered
 *       500:
 *         description: Internal server error
 */

router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email using the verification token sent during registration. The token is valid for 24 hours.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email verification token.
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{64}$"
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully. You can now login.
 *       400:
 *         description: Invalid or expired verification token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired verification token
 *       500:
 *         description: Internal server error
 */

router.get('/verify-email/:token', verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a verified user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       403:
 *         description: Email address has not been verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please verify your email before logging in
 *       500:
 *         description: Internal server error
 */

router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: If an account with the provided email exists, a password reset link is sent to the user's email. For security reasons, this endpoint always returns the same success response regardless of whether the email is registered.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: If an account with that email exists, a password reset link has been sent.
 *       500:
 *         description: Internal server error
 */

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid password reset token. The token must be valid and not expired.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token sent via email.
 *         schema:
 *           type: string
 *           minLength: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful. You can now login.
 *       400:
 *         description: Invalid or expired password reset token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */

router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /auth/upload-avatar:
 *   post:
 *     summary: Upload or update user avatar
 *     description: Uploads a new profile picture for the authenticated user. If an existing avatar is present, it is deleted from Cloudinary before the new one is uploaded.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload.
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 avatar:
 *                   type: string
 *                   format: uri
 *                   example: https://res.cloudinary.com/demo/image/upload/v123456789/avatar.jpg
 *       400:
 *         description: No image uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please upload an image
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: Returns the profile details of the currently authenticated user.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 686f4d8cf7b4f71d1b52c4c1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john@example.com
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 *                 avatar:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/demo/image/upload/v123456789/avatar.jpg
 *                     publicId:
 *                       type: string
 *                       example: avatars/abc123xyz
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/profile', protect, getProfile);

module.exports = router;