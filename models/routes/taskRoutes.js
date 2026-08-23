const express = require('express');
const Task = require('../Task');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateJsonContentType,
  validateTaskInput
} = require('../middleware/validateMiddleware');

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
});

router.post('/', validateJsonContentType, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const newTask = await Task.create({
      title,
      description
    });

    return res.status(201).json(newTask);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', validateJsonContentType, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
      task
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
