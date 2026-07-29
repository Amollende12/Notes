import React, { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onSubmit, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Update input values when the edit note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setError('');
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ title, content });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="note-title">Title</label>
            <input
              type="text"
              id="note-title"
              className="form-input"
              placeholder="e.g. Weekly Groceries"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="form-input"
              placeholder="Start writing..."
              rows="6"
              style={{ resize: 'vertical' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {note ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
