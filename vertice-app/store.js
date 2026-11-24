import { seedPosts } from './data.js';

const STORAGE_KEY = 'vertice.app.v1';
const emptyState = () => ({
  profile: null, exploredLessons: [], completedLessons: [], experiments: [], notes: [],
  connections: [], posts: seedPosts.map(post => structuredClone(post)), updatedAt: new Date().toISOString()
});

function normalize(value) {
  const base = emptyState();
  return {
    ...base, ...value,
    profile: value?.profile ?? null,
    exploredLessons: Array.isArray(value?.exploredLessons) ? value.exploredLessons : [],
    completedLessons: Array.isArray(value?.completedLessons) ? value.completedLessons : [],
    experiments: Array.isArray(value?.experiments) ? value.experiments : [],
    notes: Array.isArray(value?.notes) ? value.notes : [],
    connections: Array.isArray(value?.connections) ? value.connections : [],
    posts: Array.isArray(value?.posts) ? value.posts : base.posts
  };
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : emptyState();
  } catch (error) {
    console.warn('Os dados locais da Vértice não puderam ser lidos.', error);
    return emptyState();
  }
}

let state = read();
const clone = value => structuredClone(value);

async function commit(mutator) {
  mutator(state);
  state.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.warn('Não foi possível salvar neste navegador.', error); }
  return clone(state);
}

export const store = {
  async getState() { return clone(state); },
  async getProfile() { return clone(state.profile); },
  async saveProfile(profile) {
    return commit(current => { current.profile = { ...current.profile, ...profile, updatedAt: new Date().toISOString() }; });
  },
  async markExplored(lessonId) {
    return commit(current => { if (!current.exploredLessons.includes(lessonId)) current.exploredLessons.push(lessonId); });
  },
  async completeLesson(lessonId) {
    return commit(current => { if (!current.completedLessons.includes(lessonId)) current.completedLessons.push(lessonId); });
  },
  async saveExperiment(experiment) {
    return commit(current => { current.experiments.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...experiment }); });
  },
  async saveNote(note) {
    const id = note.id || crypto.randomUUID();
    await commit(current => {
      const index = current.notes.findIndex(item => item.id === id);
      const value = { ...current.notes[index], ...note, id, updatedAt: new Date().toISOString() };
      if (index < 0) { value.createdAt = value.createdAt || new Date().toISOString(); current.notes.unshift(value); }
      else current.notes[index] = value;
    });
    return id;
  },
  async deleteNote(noteId) { return commit(current => { current.notes = current.notes.filter(note => note.id !== noteId); current.connections = current.connections.filter(link => link.from !== noteId && link.to !== noteId); }); },
  async connectNotes(from, to, label = '') {
    if (!from || !to || from === to) return null;
    return commit(current => {
      const exists = current.connections.some(link => (link.from === from && link.to === to) || (link.from === to && link.to === from));
      if (!exists) current.connections.unshift({ id: crypto.randomUUID(), from, to, label, createdAt: new Date().toISOString() });
    });
  },
  async addPost(post) { return commit(current => { current.posts.unshift({ id: crypto.randomUUID(), author: state.profile?.name || 'Você', createdAt: new Date().toISOString(), replies: [], ...post }); }); },
  async addReply(postId, text) {
    return commit(current => {
      const post = current.posts.find(item => item.id === postId);
      if (post) post.replies.push({ id: crypto.randomUUID(), author: state.profile?.name || 'Você', text, createdAt: new Date().toISOString() });
    });
  },
  async reset() {
    state = emptyState();
    try { localStorage.removeItem(STORAGE_KEY); }
    catch (error) { console.warn('Não foi possível limpar os dados locais.', error); }
    return clone(state);
  },
  async exportJSON() { return JSON.stringify(state, null, 2); }
};
