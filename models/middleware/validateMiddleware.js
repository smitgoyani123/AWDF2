function hasJsonContentType(req) {
  const contentType = req.headers['content-type'] || '';
  return contentType.toLowerCase().startsWith('application/json');
}

function validateJsonContentType(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && !hasJsonContentType(req)) {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  return next();
}

function validateRegisterInput(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  return next();
}

function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  return next();
}

function validateTaskInput(req, res, next) {
  const { title } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  return next();
}

module.exports = {
  validateJsonContentType,
  validateRegisterInput,
  validateLoginInput,
  validateTaskInput
};
