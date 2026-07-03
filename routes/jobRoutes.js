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
    deleteJob
} = require('../controllers/jobController');

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, validate(jobSchema), createJob);
router.put('/:id', protect, validate(jobSchema), updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;