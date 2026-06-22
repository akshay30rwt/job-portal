const Job = require('../models/Job');

const createJob = async (req, res) => {
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
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.status(200).json(jobs);
};

const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (job === null) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }
    res.status(200).json(job);
};

const updateJob = async (req, res) => {
    const { title, company, location, salary } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
        req.params.id,
        { title, company, location, salary },
        { new: true }
    );

    if (updatedJob === null) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }
    res.status(200).json(updatedJob);
};

const deleteJob = async (req, res) => {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (deletedJob === null) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }
    res.status(200).json({ message: `Job ${deletedJob.title} deleted successfully` });
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };