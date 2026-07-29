import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Notes = ({ username, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Could not retrieve notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNoteClick = () => {
    setSelectedNote(null);
    setModalOpen(true);
  };

  const handleEditNoteClick = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const handleModalSubmit = async (noteData) => {
    setError('');
    try {
      if (selectedNote) {
        // Update existing note
        const response = await api.put(`/notes/${selectedNote.id}`, noteData);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === selectedNote.id ? response.data : note))
        );
      } else {
        // Create new note
        const response = await api.post('/notes', noteData);
        setNotes((prevNotes) => [response.data, ...prevNotes]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving note:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save the note. Please try again.');
      }
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setError('');
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete the note. Please try again.');
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <Navbar username={username} onLogout={onLogout} />

      <div className="notes-container">
        {error && (
          <div className="error-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="notes-header">
          <div className="notes-search-bar">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="form-input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddNoteClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Note
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your notes workspace...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--text-muted)' }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="11" y2="17" />
            </svg>
            <h3 className="empty-state-title">No notes found</h3>
            <p className="empty-state-desc">
              {searchQuery
                ? `We couldn't find any notes matching "${searchQuery}"`
                : 'Create your first note to start organizing your ideas!'}
            </p>
            {!searchQuery && (
              <button className="btn btn-primary" onClick={handleAddNoteClick}>
                Add Note
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNoteClick}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </div>

      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        note={selectedNote}
      />
    </div>
  );
};

export default Notes;
