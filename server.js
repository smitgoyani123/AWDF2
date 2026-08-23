const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./models/routes/taskRoutes');
const authRoutes = require('./models/routes/authRoutes');

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello,welcome to 24IT026 server');
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use((err, req, res, next) => {
    console.error(err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }
    // Invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid task ID'
        });
    }
    res.status(500).json({
        error: 'Internal server error'
    });
});

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
