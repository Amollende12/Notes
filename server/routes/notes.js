const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory database of notes
let notes = [
  {
    id: '1',
    title: 'First Note',
    content: 'This is a sample note that is loaded from the server by default. You can edit, delete, or create new notes here!',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    title: 'Work Checklist',
    content: '- Review pull requests\n- Complete Stage 1 of Notes App\n- Read advanced API documentation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /notes - Get all notes (Protected)
router.get('/', auth, (req, res) => {
  return res.status(200).json(notes);
});

// POST /notes - Create a new note (Protected)
router.post('/', auth, (req, res) => {
  const { title, content } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newNote = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content ? content.trim() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(newNote);
  return res.status(201).json(newNote);
});

// PUT /notes/:id - Update an existing note (Protected)
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title.trim(),
    content: content ? content.trim() : '',
    updatedAt: new Date().toISOString()
  };

  return res.status(200).json(notes[noteIndex]);
});

// DELETE /notes/:id - Delete a note (Protected)
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const deletedNote = notes[noteIndex];
  notes = notes.filter(n => n.id !== id);

  return res.status(200).json({
    message: 'Note deleted successfully',
    id: deletedNote.id
  });
});

module.exports = router;
