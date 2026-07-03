const Job = require('../models/Job');
const AppError = require('../utils/AppError');

const createJob = async (req, res, next) => {
    try {
        const { title, company, location, salary } = req.body;

        const job = new Job({
            title,
            company,
            location,
            salary,
            postedBy: req.userId
        });

        await job.save();
        res.status(201).json(job);
    }
    catch(err) {
        next(err);
    }
};

const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email');
        res.status(200).json(jobs);
    }
    catch(err) {
        next(err);
    }
};

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (job === null) {
            throw new AppError('Job not found', 404);
        }
        res.status(200).json(job);
    }
    catch(err) {
        next(err);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const { title, company, location, salary } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { title, company, location, salary },
            { new: true }
        );

        if (updatedJob === null) {
            throw new AppError('Job not found', 404);
        }
        res.status(200).json(updatedJob);
    }
    catch(err) {
        next(err);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (deletedJob === null) {
            throw new AppError('Job not found', 404);
        }
        res.status(200).json({ message: `Job ${deletedJob.title} deleted successfully` });
    }
    catch(err) {
        next(err);
    }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };