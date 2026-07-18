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
 *                 example: Backend Developer
 *               company:
 *                 type: string
 *                 example: OpenAI
 *               location:
 *                 type: string
 *                 example: San Francisco, CA
 *               salary:
 *                 type: number
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
 *     description: Retrieves all jobs along with the name and email of the user who posted each job.
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
 *                       email:
 *                         type: string
 *                         format: email
 *       500:
 *         description: Internal server error
 */

router.get('/details/full', getJobsWithUserDetails);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieves all available job postings.
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
 *       500:
 *         description: Internal server error
 */

router.get('/', getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Retrieves a specific job posting by its ID.
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
 *     responses:
 *       200:
 *         description: Job retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *     description: Updates an existing job posting.
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
 *                 example: Senior Backend Developer
 *               company:
 *                 type: string
 *                 example: OpenAI
 *               location:
 *                 type: string
 *                 example: Remote
 *               salary:
 *                 type: number
 *                 example: 150000
 *     responses:
 *       200:
 *         description: Job updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *     description: Deletes a job posting by its ID.
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
 *                   example: Job Backend Developer deleted successfully
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', protect, deleteJob);

module.exports = router;