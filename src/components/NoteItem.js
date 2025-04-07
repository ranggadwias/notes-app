class NoteItem extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['note-title', 'note-body'];
  }

  attributeChangedCallback() {
    this.render();
  }

  showNoteForm() {
    let form = document.querySelector('note-form');

    if (!form) {
      form = document.createElement('note-form');
      document.body.appendChild(form);
    } else {
      form.style.display = 'block';
    }

    form.setEditMode({
      id: this.getAttribute('note-id'),
      title: this.getAttribute('note-title'),
      body: this.getAttribute('note-body'),
      archived: this.getAttribute('note-archived') === 'true' ? true : false,
    });
  }

  render() {
    const title = this.getAttribute('note-title') || 'Tidak ada judul';
    const body = this.getAttribute('note-body') || 'Tidak ada catatan';

    this.innerHTML = `
      <div class="note">
        <div class="details">
          <h2>${title}</h2>
          <p>${body}</p>
        </div>
      </div>
    `;

    this.querySelector('.note').addEventListener('click', () => this.showNoteForm());
  }
}

customElements.define('note-item', NoteItem);