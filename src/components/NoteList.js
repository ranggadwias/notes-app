import { getNotes, createNote, deleteNote } from '../api/notesApi.js';
import { gsap } from 'gsap';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.notes = [];
    this._activeTab = 'notes';
  }

  async connectedCallback() {
    this.notes = await getNotes();
    this.render();

    document.addEventListener('tab-changed', (e) => {
      this.activeTab = e.detail.selectedTab === 'notes' ? 'notes' : 'archive';
    });

    document.addEventListener('note-add', async (e) => {
      await createNote(e.detail);
      this.notes = await getNotes();
      this.render();
    });

    document.addEventListener('note-delete', async (e) => {
      await deleteNote(e.detail.noteId);
      this.notes = await getNotes();
      this.render();
    });
  }

  set activeTab(tabName) {
    this._activeTab = tabName;
    this.render();
  }

  get activeTab() {
    return this._activeTab;
  }

  render() {
    this.innerHTML = '';
    const filteredNotes = this.notes.filter((note) =>
      this.activeTab === 'notes' ? !note.archived : note.archived,
    );

    this.innerHTML = `
      <div class="note-wrapper">
        ${
          filteredNotes.length > 0
            ? filteredNotes
                .map(
                  (note) => `
            <note-item
              note-id="${note.id}" 
              note-title="${note.title}" 
              note-body="${note.body}">
            </note-item>`,
                )
                .join('')
            : '<div class="empty-message">Tidak ada catatan.</div>'
        }
      </div>
    `;

    const noteItems = this.querySelectorAll('note-item');

    if (noteItems.length > 0) {
      gsap.set(noteItems, { y: -20, opacity: 0 });
      gsap.to(noteItems, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }
}

customElements.define('note-list', NoteList);
