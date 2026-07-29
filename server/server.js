require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use('/', authRoutes); // POST /login
app.use('/notes', notesRoutes); // GET, POST, PUT, DELETE /notes

// Default base route
app.get('/', (req, res) => {
  res.json({ message: 'Notes App API Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
