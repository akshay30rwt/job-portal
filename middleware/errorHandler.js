const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        message,
        status: statusCode
    });
}

module.exports = errorHandler;