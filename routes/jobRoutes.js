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
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: No token provided
 */

router.post('/', protect, validate(jobSchema), createJob);

/**
 * @swagger
 * /jobs/details/full:
 *   get:
 *     summary: Get all jobs with user details
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Available jobs with user details
 */

router.get('/details/full', getJobsWithUserDetails);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Available jobs 
 */

router.get('/', getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by id
 *     tags: [Jobs]
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         description: job ID
 *         schema: 
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Available jobs 
 *       404:
 *         description: Job not found
 */

router.get('/:id', getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         description: job ID
 *         schema: 
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'        
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       401:
 *         description: No token provided
 *       404:
 *         description: Job not found
 */

router.put('/:id', protect, validate(jobSchema), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         description: job ID
 *         schema: 
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'        
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: No token provided
 *       404:
 *         description: Job not found
 */

router.delete('/:id', protect, deleteJob);

module.exports = router;