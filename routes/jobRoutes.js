const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { jobSchema } = require('../validators/jobValidator');
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsWithUserDetails
} = require('../controllers/jobController');

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     description: Creates a new job posting associated with the authenticated user.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - location
 *               - salary
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Backend Developer
 *               company:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: OpenAI
 *               location:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Remote
 *               salary:
 *                 type: number
 *                 minimum: 0
 *                 example: 120000
 *     responses:
 *       201:
 *         description: Job created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 company:
 *                   type: string
 *                 location:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 postedBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error
 */

router.post('/', protect, validate(jobSchema), createJob);

/**
 * @swagger
 * /jobs/details/full:
 *   get:
 *     summary: Get all jobs with poster details
 *     description: Retrieves all job postings along with the name and email of the user who posted each job.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   location:
 *                     type: string
 *                   salary:
 *                     type: number
 *                   postedByUser:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *       500:
 *         description: Internal server error
 */

router.get('/details/full', getJobsWithUserDetails);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieves all available job postings along with basic information about the user who posted each job.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   location:
 *                     type: string
 *                   salary:
 *                     type: number
 *                   postedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */

router.get('/', getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Retrieves a specific job by its ID along with the basic information of the user who posted it.
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the job.
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *           example: 64f0d5b6b8c2e14b5b5d1234
 *     responses:
 *       200:
 *         description: Job retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 company:
 *                   type: string
 *                 location:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 postedBy:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john@example.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error
 */

router.get('/:id', getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job
 *     description: Updates an existing job by its ID.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the job.
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *           example: 64f0d5b6b8c2e14b5b5d1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - location
 *               - salary
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Senior Backend Developer
 *               company:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: OpenAI
 *               location:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Remote
 *               salary:
 *                 type: number
 *                 minimum: 0
 *                 example: 150000
 *     responses:
 *       200:
 *         description: Job updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 company:
 *                   type: string
 *                 location:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 postedBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error
 */

router.put('/:id', protect, validate(jobSchema), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     description: Deletes a job by its ID.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the job.
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *           example: 64f0d5b6b8c2e14b5b5d1234
 *     responses:
 *       200:
 *         description: Job deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job deleted successfully
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', protect, deleteJob);

module.exports = router;