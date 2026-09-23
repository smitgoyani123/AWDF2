const express = require('express');
const Task = require('../Task');
const cache = require('../../cache');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateJsonContentType,
  validateTaskInput
} = require('../middleware/validateMiddleware');

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  const requestStart = process.hrtime.bigint();

  try {
    const cachedTasks = cache.get('all_tasks');
    if (cachedTasks) {
      const requestEnd = process.hrtime.bigint();
      const duration = Number(requestEnd - requestStart) / 1e6; // Convert to milliseconds
      res.set('X-Cache', 'HIT');
      res.set('X-Response-Time', `${duration} ms`);
      console.log(`GET /tasks (cache hit) - Duration: ${duration.toFixed(2)} ms`);
      return res.status(200).json(cachedTasks);
    }

    const tasks = await Task.find();
    cache.set('all_tasks', tasks);
    res.set('X-Cache', 'MISS');
    res.set(
      'X-Response-Time',
      `${Number(process.hrtime.bigint() - requestStart) / 1000000} ms`
    );
    
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

    cache.del('all_tasks');

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

    cache.del('all_tasks');

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

    cache.del('all_tasks');

    return res.status(200).json({
      message: 'Task deleted successfully',
      task
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
