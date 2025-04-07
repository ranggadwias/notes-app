class AddButton extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    this.querySelector('.fab').addEventListener('click', () => {
      this.showNoteForm();
    });
  }

  showNoteForm() {
    let form = document.querySelector('note-form');

    if (!form) {
      form = document.createElement('note-form');
      document.body.appendChild(form);
    } else {
      form.style.display = 'block';
    }
  }

  render() {
    this.innerHTML = `
      <button class="fab">+</button>
    `;
  }
}

customElements.define('add-button', AddButton);