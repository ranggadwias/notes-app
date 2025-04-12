import NProgress from 'nprogress';
NProgress.configure({ showSpinner: false });
import 'nprogress/nprogress.css';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export async function getNotes() {
  try {
    NProgress.start();
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      alert(responseJson.message);
    } else {
      return responseJson.data;
    }
  } catch (error) {
    alert(error);
  } finally {
    NProgress.done();
  }
}

export async function createNote(noteData) {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    };

    NProgress.start();
    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      alert(responseJson.message);
    } else {
      return responseJson.data;
    }
  } catch (error) {
    alert(error);
  } finally {
    NProgress.done();
  }
}

export async function deleteNote(noteId) {
  try {
    const options = { method: 'DELETE' };

    NProgress.start();
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, options);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      alert(responseJson.message);
    } else {
      return true;
    }
  } catch (error) {
    alert(error);
    return false;
  } finally {
    NProgress.done();
  }
}
