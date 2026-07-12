const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(`Connection failed`, error);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});