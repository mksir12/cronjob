const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret_key_here';

// Simple in-memory user store & cron jobs store
const users = {
  'user@example.com': { password: 'password123', jobs: [] }
};

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Get user's cron jobs
app.get('/jobs', authenticateToken, (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ jobs: user.jobs });
});

// Add a cron job
app.post('/jobs', authenticateToken, (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { title, url, interval } = req.body;
  if (!title || !url || !interval) {
    return res.status(400).json({ error: 'Title, url and interval required' });
  }

  const newJob = {
    id: Date.now().toString(),
    title,
    url,
    interval
  };

  user.jobs.push(newJob);
  res.json(newJob);
});

// Delete a cron job
app.delete('/jobs/:id', authenticateToken, (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.jobs = user.jobs.filter(job => job.id !== req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
