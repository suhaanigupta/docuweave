import express from 'express';

const router = express.Router();

const users = []; // In-memory DB for now

// Register route
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ email, password }); // You should hash this in real app
  res.json({ message: 'User registered' });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ user: { email } });
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;