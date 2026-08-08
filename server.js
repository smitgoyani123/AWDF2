const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

function validateJsonContentType(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  next();
}

app.get('/', (req, res) => {
  res.send('Hello,welcome to 24IT026 server');
});

app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

app.post('/tasks', validateJsonContentType, async (req, res, next) => {
    try {
        const { title, description } = req.body;
        // if (!title) {
        //     return res.status(400).json({
        //         error: 'Title is required'
        //     });
        // }
        const newTask = await Task.create({
            title,
            description
        });
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

app.put('/tasks/:id', validateJsonContentType, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }
        res.status(200).json({
            message: 'Task deleted successfully',
            task: task
        });
    } catch (err) {
        next(err);
    }
});
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

app.listen(5000, () => console.log('Server running on port 5000'));
