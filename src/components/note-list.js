import { notesData } from '../data/notes.js';

class NoteList extends HTMLElement{
  constructor() {
    super();

    const savedNotes = localStorage.getItem('notes');
    this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    if (savedNotes === null) {
      localStorage.setItem('notes', JSON.stringify(notesData));
      this.notes = [...notesData];
    }

    this._activeTab = 'notes';
  }

  connectedCallback() {
    this.render();

    document.addEventListener('tab-changed', (e) => {
      this.activeTab = e.detail.selectedTab === 'notes' ? 'notes' : 'archive';
    });

    document.addEventListener('note-add', (e) => {
      this.addNote(e.detail);
    });

    document.addEventListener('note-update', (e) => {
      this.updateNote(e.detail);
    });

    document.addEventListener('note-delete', (e) => {
      this.deleteNote(e.detail.noteId);
    })
  }

  set activeTab(tabName) {
    this._activeTab = tabName;
    this.render();
  }

  get activeTab() {
    return this._activeTab;
  }

  addNote(noteData) {
    const existingNote = this.notes.find(note => note.id === noteData.id);
    if (existingNote) {
      this.updateNote(noteData);
    } else {
      this.notes = [noteData, ...this.notes];
      localStorage.setItem('notes', JSON.stringify(this.notes));
      this.render();
    }
  }

  updateNote(noteData) {
    this.notes = this.notes.map(note => 
      note.id === noteData.id ? { ...note, ...noteData } : note
    );
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.render();
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.render();
  }

  render() {
    this.innerHTML = '';
    const filteredNotes = this.notes.filter(note => 
      this.activeTab === 'notes' ? !note.archived : note.archived
    );

    this.innerHTML = `
      <div class="note-wrapper">
        ${filteredNotes.length > 0 
          ? filteredNotes.map(note => `
            <note-item 
              note-id="${note.id}" 
              note-title="${note.title}" 
              note-body="${note.body}" 
              note-archived="${note.archived}">
            </note-item>`).join('')
          : '<div class="empty-message">Tidak ada catatan.</div>'}
      </div>
    `;
  }
}

customElements.define('note-list', NoteList);