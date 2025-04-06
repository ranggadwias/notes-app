class NoteForm extends HTMLElement{
  constructor() {
    super();
    this._formEventListener = false;
    this._closeEventListener = false;
    this.editMode = false;
    this.noteId = null;
  }

  connectedCallback() {
    this.render();
    this.hideNoteForm();
    this.setupEventListener();
  }

  setupEventListener() {
    const form = this.querySelector('#addNote');
    const title = this.querySelector('#title');
    const body = this.querySelector('#body');
    const deleteBtn = this.querySelector('#deleteButton');
    const closeIcon = this.querySelector('.ri-close-fill');

    if (form && !this._formEventListener) {
      form.addEventListener('input', (e) => {
        const input = e.target;
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
          this.validateInput(input);
        }
      });

      form.addEventListener('blur', (e) => {
        const input = e.target;
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
          this.validateInput(input);
        }
      }, true);

      form.addEventListener('submit', (e) => {
        const titleTrim = title.value.trim();
        const bodyTrim = body.value.trim();
        const isArchive = this.querySelector('#isArchive').checked;

        e.preventDefault();

        if (!this.validateInput(title) || !this.validateInput(body)) return;

        if (this.editMode) {
          this.dispatchEvent(
            new CustomEvent('note-update', {
              detail: {
                id: this.noteId,
                title: titleTrim,
                body: bodyTrim,
                createdAt: new Date().toISOString(),
                archived: isArchive,
              },
              bubbles: true,
            })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent('note-add', {
              detail: {
                id: `notes-${Date.now().toString(36)}`,
                title: titleTrim,
                body: bodyTrim,
                createdAt: new Date().toISOString(),
                archived: isArchive,
              },
              bubbles: true,
            })
          );
        }

        this.hideNoteForm();
      });

      deleteBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('note-delete', {
            detail: { noteId: this.noteId },
            bubbles: true,
          })
        );

        this.hideNoteForm();
      });

      this._formEventListener = true;
    }
 
    if (!this._closeEventListener) {
      closeIcon.addEventListener('click', () => this.hideNoteForm());
      this._closeEventListener = true;
    }
  }

  hideNoteForm() {
    this.style.display = 'none';
    this.resetFormFields();
    this.hideDeleteButton();
    this.editMode = false;
    this.noteId = null;
  }

  showDeleteButton() {
    this.querySelector('#deleteButton').style.display = 'block';
  }

  hideDeleteButton() {
    this.querySelector('#deleteButton').style.display = 'none';
  }

  resetFormFields() {
    const title = this.querySelector('#title');
    const body = this.querySelector('#body');
    const isArchive = this.querySelector('#isArchive');
    const titleElement = this.querySelector('.header h2');
    const submitBtn = this.querySelector('#submitButton');

    title.value = '';
    body.value = '';
    isArchive.checked = false;
    title.classList.remove('invalid');
    body.classList.remove('invalid');

    titleElement.textContent = 'Add a New Note';
    submitBtn.textContent = 'Add New Note';
  }

  validateInput(input) {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      return false;
    } else {
      input.classList.remove('invalid');
      return true;
    }
  }

  setEditMode(noteData) {
    const title = this.querySelector('#title');
    const body = this.querySelector('#body');
    const isArchive = this.querySelector('#isArchive');
    const titleElement = this.querySelector('.header h2');
    const submitBtn = this.querySelector('#submitButton');

    this.editMode = true;
    this.noteId = noteData.id;

    title.value = noteData.title;
    body.value = noteData.body;
    isArchive.checked = noteData.archived;

    titleElement.textContent = 'Update a Note';
    submitBtn.textContent = 'Save Changes';
    this.showDeleteButton();
    this.style.display = 'block';
  }

  render() {
    this.innerHTML = `
      <div class="popup-wrapper">
        <div class="popup">
          <div class="content">
            <div class="header">
              <h2>Add a new note</h2>
              <i class="ri-close-fill"></i>
            </div>
            <form id="addNote">
              <div class="row title">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" required />
              </div>
              <div class="row body">
                <label for="body">Description</label>
                <textarea name="body" id="body" required></textarea>
              </div>
              <div class="isArchive">
                <input type="checkbox" name="isArchive" id="isArchive">
                <label for="isArchive">Archive this note</label>
              </div>
              <div class="btn">
              <button type="button" id="deleteButton" style="display: none;">Delete</button>
                <button type="submit" id="submitButton">Add New Note</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-form', NoteForm);