const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check hardcoded credentials
  if (username === 'admin' && password === '123456') {
    // Generate
    const token = jwt.sign(
      { username: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      username: 'admin'
    });
  }

  // Invalid credentials
  return res.status(401).json({ error: 'Invalid username or password' });
});

module.exports = router;
