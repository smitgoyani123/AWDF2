const express = require('express');
const app = express();

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

function validateTaskId(req, res, next) {
  const taskId = parseInt(req.params.id, 10);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({ error: 'Task ID must be a valid number' });
  }

  next();
}

let tasks = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.send('Hello,welcome to 24IT026 server');
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', validateJsonContentType, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', validateJsonContentType, validateTaskId, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.status(200).json(task);
});

app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
