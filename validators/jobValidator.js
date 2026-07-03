const Joi = require('joi');

const jobSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    company: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(100).required(),
    salary: Joi.number().min(0).required()
});

module.exports = { jobSchema };