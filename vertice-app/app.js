import { tracks, sampleTexts } from './data.js';
import { store } from './store.js';

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
const trackById = id => tracks.find(track => track.id === id);
const findLesson = id => tracks.flatMap(track => track.lessons.map(lesson => ({ ...lesson, trackId: track.id, trackName: track.name, pillar: track.pillar }))).find(lesson => lesson.id === id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const initials = name => (name || 'V').trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
const dateLabel = value => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(value));
const safeText = value => String(value ?? '').trim();

const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  pen: '<path d="m15 5 4 4M4 20l4-.8L19.2 8a2.1 2.1 0 0 0-3-3L5 16z"/><path d="M14 6 5 15M4 4h6M4 8h4"/>',
  flask: '<path d="M9 3h6M10 3v6l-5.5 9.3A2.5 2.5 0 0 0 6.6 22h10.8a2.5 2.5 0 0 0 2.1-3.7L14 9V3M8 15h8"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9h-.3a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2v-.3a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.3a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>',
  arrowLeft: '<path d="m15 18-6-6 6-6"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
const brandMark = `<a class="logo" href="vertice.html" aria-label="Vértice"><svg viewBox="0 0 34 36" aria-hidden="true"><path d="M2 13 17 1l15 12M2 23 17 11l15 12M2 33 17 21l15 12" fill="none" stroke="currentColor" stroke-width="2.2"/></svg> vértice</a>`;
const navItems = [
  ['#inicio', 'Meu caminho', 'home'], ['#trilhas', 'Todas as trilhas', 'compass'], ['#caderno', 'Minhas anotações', 'pen'],
  ['#laboratorio', 'Laboratório', 'flask'], ['#repertorio', 'Mapa de repertório', 'map'], ['#comunidade', 'Comunidade', 'users']
];

let currentRoute = '';
let activeTrackId = null;
let currentLessonId = null;
let currentStep = 0;
let selectedNoteId = null;
let noteSearch = '';
let noteFilter = 'all';
let communityFilter = 'all';
let lessonSaveTimer;
let lab = { textId: 'memoria', customText: '', phase: 0, remaining: 60, running: false, explanation: '', question: '', interval: null };
let toastTimer;

function path() {
  const raw = decodeURIComponent(location.hash.slice(1) || 'inicio');
  const [route, ...rest] = raw.split('/');
  return { route, slug: rest.join('/') };
}

function navLink([href, label, iconName], active) {
  return `<a class="nav-link ${active ? 'active' : ''}" href="${href}" ${active ? 'aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span></a>`;
}

async function render() {
  const state = await store.getState();
  const { route, slug } = path();
  currentRoute = route;
  const routeHref = `#${route}${slug ? `/${slug}` : ''}`;
  const track = route === 'trilha' ? trackById(slug) : null;
  const sectionTitle = route === 'trilha' ? (track?.name || 'Trilha') : ({ inicio: 'Meu caminho', trilhas: 'Trilhas', caderno: 'Caderno aberto', laboratorio: 'Laboratório de prática', repertorio: 'Mapa de repertório', comunidade: 'Comunidade' }[route] || 'Meu caminho');
  if (route === 'trilha' && !track) { location.hash = '#trilhas'; return; }
  if (route === 'trilha' && !currentLessonId) activeTrackId = slug;
  const activeNav = route === 'trilha' ? '#trilhas' : routeHref;
  app.innerHTML = `<div class="shell">
    <aside class="sidebar">${brandMark}<nav class="side-nav" aria-label="Navegação do espaço">${navItems.map(item => navLink(item, item[0] === activeNav)).join('')}</nav>
      <div class="side-spacer"></div><div class="side-note">Seu caminho pode mudar. O plano está aqui para ajudar.</div>
      <div class="profile-row"><span class="avatar">${esc(initials(state.profile?.name))}</span><div><strong>${esc(state.profile?.name || 'Seu espaço')}</strong><small>${state.profile?.favoriteTrack ? esc(trackById(state.profile.favoriteTrack)?.name || 'Minha conta') : 'Minha conta'}</small></div><button class="profile-settings" data-action="settings" aria-label="Abrir configurações">${icon('settings')}</button></div>
      <div class="footer-links" style="padding:16px 6px 0"><a href="vertice.html">Voltar à Vértice</a><a href="index.html">Hextech</a></div>
    </aside>
    <section class="app-main"><header class="topbar"><div class="crumb">Vértice <span aria-hidden="true">/</span> <strong>${esc(sectionTitle)}</strong></div><div class="topbar-right"><a class="top-link" href="vertice.html">Voltar à Vértice</a><button class="icon-btn" data-action="settings" aria-label="Configurações">${icon('settings')}</button></div></header>
      <main class="content">${renderRoute(state, route, slug, track)}</main>
    </section>
    <nav class="mobile-bar" aria-label="Navegação rápida">${[navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]].map(item => navLink(item, item[0] === activeNav)).join('')}</nav>
  </div>`;
  bindViewEvents();
  if (!state.profile) showWelcome();
}

function renderRoute(state, route, slug, track) {
  if (route === 'inicio') return dashboard(state);
  if (route === 'trilhas') return tracksView(state);
  if (route === 'trilha') return currentLessonId ? lessonView(state, track, findLesson(currentLessonId)) : trackView(state, track);
  if (route === 'caderno') return notebookView(state);
  if (route === 'laboratorio') return labView();
  if (route === 'repertorio') return repertoireView(state);
  if (route === 'comunidade') return communityView(state);
  location.hash = '#inicio';
  return '';
}

function dashboard(state) {
  const name = state.profile?.name?.trim().split(/\s+/)[0] || 'Que bom ter você por aqui';
  const last = state.exploredLessons.map(findLesson).find(Boolean);
  const lessonCount = state.exploredLessons.length;
  const experiments = state.experiments.length;
  const questions = state.notes.filter(note => safeText(note.question || note.nextQuestion)).length;
  const favorite = trackById(state.profile?.favoriteTrack);
  const resume = last || (favorite ? favorite.lessons[0] : tracks[0].lessons[0]);
  const resumeTrack = trackById(resume.trackId || favorite?.id || tracks[0].id);
  return `<div class="welcome-row"><section class="welcome"><div class="eyebrow">Seu espaço de aprendizagem</div><h1>Bom te ver por aqui, ${esc(name)}.</h1><p class="lead">Hoje, experimente lembrar com suas palavras. Você já deu direção à sua curiosidade; o próximo passo pode ser pequeno.</p><div class="actions" style="margin-top:18px"><a class="btn" href="#trilha/${resumeTrack.id}" data-action="resume" data-track="${resumeTrack.id}" data-lesson="${resume.id}">Retomar em 15 min ${icon('arrow')}</a><a class="btn btn-ghost" href="#trilhas">Ver todas as trilhas</a></div></section><aside class="resume-card"><div><div class="card-kicker">Sua próxima aula · ${esc(resumeTrack.name)}</div><strong>${esc(resume.title)}</strong><span class="tiny">${esc(resume.duration)} · no seu ritmo</span></div><a class="tiny" href="#trilha/${resumeTrack.id}" data-action="resume" data-track="${resumeTrack.id}" data-lesson="${resume.id}">Ajustar meu caminho ↗</a></aside></div>
    <div class="eyebrow">Progressão intelectual</div><div class="stat-grid"><div class="stat"><div class="stat-value">${lessonCount}</div><div class="stat-label">Aulas exploradas</div></div><div class="stat"><div class="stat-value">${experiments}</div><div class="stat-label">Experimentos realizados</div></div><div class="stat"><div class="stat-value">${questions}</div><div class="stat-label">Perguntas formuladas</div></div></div>
    <div class="section-label"><h2>Escolha uma direção</h2><a class="top-link" href="#trilhas">Ver todas as trilhas ↗</a></div><div class="grid grid-2">${tracks.map(track => trackCard(state, track)).join('')}</div>
    <div class="section-label"><h2>Um espaço para continuar pensando</h2></div><div class="grid grid-3"><a class="card card-soft" href="#caderno"><div class="card-kicker">Caderno aberto</div><h3>Guarde o que vale retomar.</h3><p>Registre ideias e perguntas com espaço para voltar a elas.</p></a><a class="card" href="#laboratorio"><div class="card-kicker">Prática 04 · 5 minutos</div><h3>Feche o texto. Abra uma pergunta.</h3><p>Experimente recuperar uma ideia com suas próprias palavras.</p></a><a class="card card-lime" href="#comunidade"><div class="card-kicker">Roda de conversa</div><h3>Você não precisa aprender só.</h3><p>Compartilhe uma tentativa ou deixe uma pergunta em aberto.</p></a></div>`;
}

function trackCard(state, track) {
  const done = track.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
  const explored = track.lessons.filter(lesson => state.exploredLessons.includes(lesson.id)).length;
  const pct = Math.round(done / track.lessons.length * 100);
  return `<article class="card track-card"><div class="track-card-top"></div><div class="track-card-body"><div class="track-heading"><div><div class="card-kicker">${esc(track.pillar)}</div><h3>${esc(track.name)}</h3></div><span class="pill">${explored} de ${track.lessons.length} aulas</span></div><p>${esc(track.summary)}</p><div class="progress-line" aria-label="${pct}% concluído"><span style="width:${pct}%"></span></div><div class="actions"><a class="btn btn-small" href="#trilha/${track.id}">Abrir trilha ${icon('arrow')}</a><span class="tiny">${esc(track.duration)}</span></div></div></article>`;
}

function tracksView(state) {
  return `<div class="page-head"><div><div class="eyebrow">Uma boa pergunta pode virar uma trilha</div><h1>Todas as trilhas</h1><p class="lead">Cada trilha combina ideias, exercícios e um pequeno projeto para levar o aprendizado para fora da tela.</p></div></div><div class="grid grid-2">${tracks.map(track => trackCard(state, track)).join('')}</div><div class="section-label"><h2>Não sabe por onde começar?</h2></div><div class="card card-soft"><h3>Comece pela pergunta que mais chama sua atenção hoje.</h3><p>Você pode experimentar um exercício, explorar um texto ou mudar de direção quando fizer sentido.</p><div class="actions"><a class="btn" href="#laboratorio">Experimentar uma prática ${icon('arrow')}</a><a class="btn btn-ghost" href="#comunidade">Conversar com outras pessoas</a></div></div>`;
}

function trackView(state, track) {
  const lessons = track.lessons.map((lesson, index) => `<article class="card lesson-card"><div class="track-heading"><span class="pill">${String(index + 1).padStart(2, '0')} · ${esc(lesson.duration)}</span>${state.completedLessons.includes(lesson.id) ? `<span class="pill">Ciclo concluído ${icon('check')}</span>` : ''}</div><h3 style="margin-top:14px">${esc(lesson.title)}</h3><p>${esc(lesson.idea.slice(0, 150))}…</p><div class="actions"><button class="btn btn-small" data-action="open-lesson" data-lesson="${lesson.id}">${state.exploredLessons.includes(lesson.id) ? 'Retomar aula' : 'Começar aula'} ${icon('arrow')}</button><span class="tiny">${state.completedLessons.includes(lesson.id) ? 'Já percorreu este ciclo' : 'No seu ritmo'}</span></div></article>`).join('');
  const done = track.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
  return `<div class="page-head"><div><a class="top-link" href="#trilhas">${icon('arrowLeft')} Todas as trilhas</a><div class="eyebrow" style="margin-top:20px">${esc(track.pillar)}</div><h1>${esc(track.name)}</h1><p class="lead">${esc(track.description)}</p></div><div class="card card-soft" style="min-width:170px"><div class="card-kicker">Seu caminho</div><h3>${done} de ${track.lessons.length} ciclos</h3><div class="progress-line"><span style="width:${Math.round(done / track.lessons.length * 100)}%"></span></div></div></div><div class="grid grid-3">${lessons}</div><div class="section-label"><h2>Mais jeitos de seguir</h2></div><div class="actions"><a class="btn btn-ghost" href="#caderno">Abrir o Caderno</a><a class="btn btn-ghost" href="#repertorio">Ver meu repertório</a></div>`;
}

function lessonView(state, track, lesson) {
  if (!lesson) return trackView(state, track);
  const stepLabels = ['01. Explore uma ideia', '02. Faça uma experiência', '03. Volte com perguntas'];
  let content = '';
  if (currentStep === 0) content = `<div class="eyebrow">Explore uma ideia · ${esc(track.name)}</div><h2>${esc(lesson.title)}</h2><div class="media-placeholder"><span class="play">▶</span><div><strong>Áudio ou vídeo da aula</strong><span>Roteiro em texto · 3 min · recurso demonstrativo</span></div></div><article class="reading">${esc(lesson.idea)}</article><div class="quote" style="margin:20px 0">${esc(lesson.example)}</div><div class="actions"><button class="btn btn-ghost" data-action="save-excerpt" data-lesson="${lesson.id}">Enviar trecho para o Caderno ${icon('plus')}</button><button class="btn" data-action="step" data-step="1">Fazer uma experiência ${icon('arrow')}</button></div>`;
  if (currentStep === 1) content = `<div class="eyebrow">Faça uma experiência · ${esc(track.name)}</div><h2>${esc(lesson.title)}</h2><div class="card card-soft"><div class="card-kicker">Um experimento pequeno</div><p style="font-size:.97rem;color:var(--ink)">${esc(lesson.practice)}</p><p class="tiny">Escolha um momento realista. O resultado não precisa ser perfeito para ensinar algo.</p></div><div class="field" style="margin-top:19px"><label for="experiment-note">O que você testou e o que mudou na prática?</label><textarea id="experiment-note" placeholder="Registre sua tentativa, uma observação ou algo que queira experimentar…"></textarea></div><div class="actions"><button class="btn btn-ghost" data-action="step" data-step="0">Voltar à ideia</button><button class="btn btn-ghost" data-action="save-experiment" data-lesson="${lesson.id}" data-track="${track.id}">Registrar experimento ${icon('check')}</button><button class="btn" data-action="step" data-step="2">Voltar com perguntas ${icon('arrow')}</button></div></div>`;
  if (currentStep === 2) {
    const note = state.notes.find(item => item.id === `lesson-question-${lesson.id}`);
    content = `<div class="eyebrow">Volte com perguntas · ${esc(track.name)}</div><h2>${esc(lesson.title)}</h2><p class="lead">Uma dúvida nova também é sinal de movimento. Guarde uma pergunta para retomar depois da sua experiência.</p><div class="field" style="margin-top:20px"><label for="lesson-question">Que pergunta surgiu?</label><textarea id="lesson-question" data-auto-question="${lesson.id}" placeholder="Que parte ainda está aberta para você? A pergunta será salva automaticamente no Caderno.">${esc(note?.question || '')}</textarea><span class="hint" id="autosave-status">${note?.question ? 'Pergunta salva no Caderno.' : 'Sua pergunta será salva enquanto você escreve.'}</span></div><div class="card card-lime"><div class="card-kicker">Pergunta para retomar amanhã</div><p style="color:var(--ink);margin:8px 0 0">${esc(lesson.prompt)}</p></div><div class="actions" style="margin-top:18px"><button class="btn btn-ghost" data-action="step" data-step="1">Voltar à experiência</button><button class="btn" data-action="complete-lesson" data-lesson="${lesson.id}" data-track="${track.id}">Concluir ciclo da aula ${icon('check')}</button><a class="btn btn-ghost" href="#caderno">Abrir o Caderno</a></div>`;
  }
  return `<div class="page-head"><div><a class="top-link" href="#trilha/${track.id}">${icon('arrowLeft')} ${esc(track.name)}</a><div class="eyebrow" style="margin-top:20px">Aula · ${esc(lesson.duration)}</div><h1>${esc(lesson.title)}</h1></div><span class="pill">${state.completedLessons.includes(lesson.id) ? 'Ciclo concluído' : 'Seu ritmo, suas perguntas'}</span></div><div class="stepper" role="tablist" aria-label="Etapas da aula">${stepLabels.map((label, index) => `<button role="tab" aria-selected="${currentStep === index}" class="${currentStep === index ? 'active' : ''}" data-action="step" data-step="${index}">${label}</button>`).join('')}</div><section class="card">${content}</section>`;
}

function notebookView(state) {
  const note = state.notes.find(item => item.id === selectedNoteId) || null;
  const filtered = state.notes.filter(item => {
    const matchesTrack = noteFilter === 'all' || item.trackId === noteFilter;
    const query = noteSearch.toLocaleLowerCase('pt-BR');
    return matchesTrack && (!query || `${item.title} ${item.body} ${item.question} ${item.nextQuestion}`.toLocaleLowerCase('pt-BR').includes(query));
  });
  const noteList = `<div class="note-list">${filtered.length ? filtered.map(item => `<button class="note-item ${item.id === note?.id ? 'selected' : ''}" data-action="select-note" data-note="${esc(item.id)}"><strong>${esc(item.title || 'Anotação sem título')}</strong><small>${esc(trackById(item.trackId)?.name || 'Anotação livre')} · ${dateLabel(item.updatedAt || item.createdAt)}</small><small style="display:block;margin-top:5px">${esc((item.body || item.question || item.nextQuestion || 'Sem texto').slice(0, 78))}</small></button>`).join('') : `<div class="empty">${icon('pen')}<div>Ainda não há anotações neste recorte.</div></div>`}</div>`;
  const related = note ? state.connections.filter(link => link.from === note.id || link.to === note.id).map(link => state.notes.find(item => item.id === (link.from === note.id ? link.to : link.from))).filter(Boolean) : [];
  const editor = note ? `<form data-form="note" class="card note-editor" data-note="${esc(note.id)}"><div class="page-head"><div><div class="eyebrow">Anotação</div><h2 style="margin:5px 0">Retome uma ideia.</h2></div><button class="btn btn-danger btn-small" type="button" data-action="delete-note" data-note="${esc(note.id)}">Excluir</button></div><div class="field"><label for="note-title">Título</label><input id="note-title" name="title" value="${esc(note.title || '')}" placeholder="Uma ideia para guardar"></div><div class="field"><label for="note-track">Trilha vinculada</label><select id="note-track" name="trackId"><option value="">Sem trilha</option>${tracks.map(track => `<option value="${track.id}" ${note.trackId === track.id ? 'selected' : ''}>${esc(track.name)}</option>`).join('')}</select></div><div class="field"><label for="note-body">Anotação</label><textarea id="note-body" name="body" placeholder="Escreva uma ideia, uma citação ou uma observação…">${esc(note.body || '')}</textarea></div><div class="field"><label for="note-question">Pergunta para retomar amanhã</label><textarea id="note-question" name="nextQuestion" class="short card-lime" placeholder="Qual pergunta merece mais um pouco de espaço?">${esc(note.nextQuestion || note.question || '')}</textarea></div><div class="actions"><button class="btn" type="submit">Salvar anotação ${icon('check')}</button></div></form>` : `<div class="card note-editor"><div class="empty">${icon('book')}<h3>Seu caderno está aberto.</h3><p>Escolha uma anotação para retomar ou crie uma nova.</p><button class="btn" data-action="new-note">Criar anotação ${icon('plus')}</button></div></div>`;
  const connect = note ? `<div class="card" style="margin-top:14px"><div class="card-kicker">Criar conexão</div><h3>Que outra ideia conversa com esta?</h3>${related.length ? `<div class="stack" style="margin:12px 0">${related.map(item => `<div class="list-row"><div class="list-row-copy"><strong>${esc(item.title || 'Anotação sem título')}</strong><small>${esc(item.body?.slice(0, 85) || item.question || '')}</small></div></div>`).join('')}</div>` : '<p class="tiny">Conecte esta nota a outra para perceber relações entre ideias.</p>'}<form data-form="connect-note"><input type="hidden" name="from" value="${esc(note.id)}"><div class="form-grid"><div class="field"><label for="connect-to">Outra anotação</label><select id="connect-to" name="to" required><option value="">Escolher anotação</option>${state.notes.filter(item => item.id !== note.id).map(item => `<option value="${esc(item.id)}">${esc(item.title || 'Anotação sem título')}</option>`).join('')}</select></div><div class="field"><label for="connect-label">O que as aproxima?</label><input id="connect-label" name="label" placeholder="Uma pergunta, uma imagem…"></div></div><button class="btn btn-ghost btn-small" type="submit" ${state.notes.length < 2 ? 'disabled' : ''}>Criar conexão ${icon('link')}</button></form></div>` : '';
  return `<div class="page-head"><div><div class="eyebrow">Ideias, trechos e perguntas</div><h1>Caderno aberto</h1><p class="lead">Guarde o que vale retomar. Uma anotação pode mudar quando encontra outra pergunta.</p></div><button class="btn" data-action="new-note">Nova anotação ${icon('plus')}</button></div><div class="toolbar"><label class="sr-only" for="note-search">Buscar no Caderno</label><input id="note-search" type="search" value="${esc(noteSearch)}" placeholder="Buscar uma ideia ou pergunta…"> <label class="sr-only" for="note-filter">Filtrar pela trilha</label><select id="note-filter"><option value="all">Todas as trilhas</option>${tracks.map(track => `<option value="${track.id}" ${noteFilter === track.id ? 'selected' : ''}>${esc(track.name)}</option>`).join('')}</select></div><div class="note-layout"><div id="note-list-container">${noteList}</div><div>${editor}${connect}</div></div>`;
}

function formatTime(seconds) { const safe = Math.max(0, seconds); return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`; }
function labText() { return lab.textId === 'custom' ? lab.customText : sampleTexts.find(item => item.id === lab.textId)?.text || sampleTexts[0].text; }
function labView() {
  const durations = [60, 120, 120];
  const steps = ['Leia um trecho', 'Explique de memória', 'Compare e retome'];
  const total = durations[lab.phase] || 120;
  const pct = Math.max(0, Math.min(100, (1 - lab.remaining / total) * 100));
  let stage = '';
  if (lab.phase === 0) stage = `<div class="eyebrow">Etapa 1 · 1 minuto</div><h2>Leia com atenção.</h2><p class="muted" style="line-height:1.6">Escolha um dos textos ou cole um trecho seu. Leia uma vez com calma; não precisa memorizar cada frase.</p><div class="field"><label for="sample-select">Texto para experimentar</label><select id="sample-select">${sampleTexts.map(item => `<option value="${item.id}" ${lab.textId === item.id ? 'selected' : ''}>${esc(item.label)}</option>`).join('')}<option value="custom" ${lab.textId === 'custom' ? 'selected' : ''}>Colar meu próprio texto</option></select></div>${lab.textId === 'custom' ? `<div class="field"><label for="custom-reading">Seu texto</label><textarea id="custom-reading" placeholder="Cole aqui um trecho curto para ler.">${esc(lab.customText)}</textarea></div>` : ''}<div class="text-sample">${esc(labText())}</div>`;
  if (lab.phase === 1) stage = `<div class="eyebrow">Etapa 2 · 2 minutos</div><h2>Feche o texto. Abra uma pergunta.</h2><div class="card card-soft"><p style="margin:0;color:var(--ink)">O texto original está guardado, mas agora fica fora de vista. Escreva a ideia central com suas palavras e dê um exemplo.</p></div><div class="field" style="margin-top:16px"><label for="lab-explanation">Minha explicação, sem consultar</label><textarea id="lab-explanation" placeholder="O que ficou? Que exemplo ajuda a explicar?">${esc(lab.explanation)}</textarea></div>`;
  if (lab.phase === 2) stage = `<div class="eyebrow">Etapa 3 · 2 minutos</div><h2>Compare. Escolha um próximo passo.</h2><div class="compare-grid"><div><div class="card-kicker" style="margin:0 0 8px">Trecho original</div><div class="compare-box">${esc(labText())}</div></div><div><div class="card-kicker" style="margin:0 0 8px">Sua explicação</div><div class="compare-box">${esc(lab.explanation || 'Você ainda não registrou uma explicação. Pode experimentar agora.')}</div></div></div><div class="field" style="margin-top:17px"><label for="lab-question">Pergunta específica para retomar</label><textarea id="lab-question" class="short" placeholder="O que você quer entender melhor depois desta comparação?">${esc(lab.question)}</textarea></div><div class="card card-lime"><div class="card-kicker">Para levar com você</div><p style="color:var(--ink);margin:6px 0 0">Uma explicação incompleta também mostra por onde continuar. A pergunta pode ser pequena e concreta.</p></div><div class="actions" style="margin-top:14px"><button class="btn" data-action="save-lab-note">Salvar no Caderno ${icon('check')}</button><button class="btn btn-ghost" data-action="save-lab-experiment">Registrar como experimento</button></div>`;
  return `<div class="page-head"><div><div class="eyebrow">Prática 04 · 5 minutos</div><h1>Feche o texto. Abra uma pergunta.</h1><p class="lead">Uma experiência breve de recuperação ativa. Observe como funciona para você e ajuste o tamanho do trecho.</p></div><span class="pill">No seu ritmo</span></div><div class="lab-layout"><section class="card"><div class="track-heading"><div><div class="card-kicker">${steps[lab.phase]}</div><h2 class="lab-clock" style="margin:7px 0 0">${formatTime(lab.remaining)}</h2></div><span class="tiny">${lab.running ? 'Cronômetro em andamento' : lab.phase === 2 ? 'Compare sem pressa' : 'Quando estiver pronto'}</span></div><div class="timer-track"><span style="width:${pct}%"></span></div><div class="stepper">${steps.map((step, index) => `<button class="${lab.phase === index ? 'active' : ''}" data-action="lab-go" data-phase="${index}">${String(index + 1).padStart(2, '0')} · ${step}</button>`).join('')}</div>${stage}<div class="actions" style="margin-top:18px">${lab.phase < 2 ? `<button class="btn" data-action="lab-toggle">${lab.running ? 'Pausar cronômetro' : lab.remaining === durations[lab.phase] ? 'Começar etapa' : 'Continuar'} ${icon('clock')}</button><button class="btn btn-ghost" data-action="lab-next">${lab.phase === 0 ? 'Já li, continuar' : 'Concluir etapa'} ${icon('arrow')}</button>` : '<button class="btn btn-ghost" data-action="lab-go" data-phase="1">Voltar à minha explicação</button>'}</div></section><aside class="stack"><div class="card card-soft"><div class="card-kicker">Como funciona</div><h3>Leia, lembre, compare.</h3><p>O cronômetro sugere um ritmo, não mede seu desempenho. Você pode pausar, pular uma etapa ou voltar ao texto quando quiser.</p></div><div class="card"><div class="card-kicker">Pergunta em aberto</div><p style="margin:9px 0 0">Que ponto você gostaria de conseguir explicar com mais clareza?</p><a class="top-link" href="#caderno">Guardar uma ideia no Caderno ↗</a></div></aside></div>`;
}

function repertoireView(state) {
  const values = tracks.map(track => ({ track, done: track.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length }));
  const max = Math.max(1, ...values.map(item => item.track.lessons.length));
  const items = [
    ...state.experiments.map(item => ({ type: 'Experimento aplicado', text: item.body, title: item.lessonTitle || trackById(item.trackId)?.name, date: item.createdAt, order: new Date(item.createdAt).getTime() })),
    ...state.notes.filter(note => note.question || note.nextQuestion).map(note => ({ type: 'Pergunta aberta', text: note.question || note.nextQuestion, title: note.title, date: note.updatedAt || note.createdAt, order: new Date(note.updatedAt || note.createdAt).getTime() })),
    ...state.connections.map(item => ({ type: 'Conexão criada', text: item.label || 'Duas ideias foram aproximadas no Caderno.', title: [state.notes.find(note => note.id === item.from)?.title, state.notes.find(note => note.id === item.to)?.title].filter(Boolean).join(' ↔ '), date: item.createdAt, order: new Date(item.createdAt).getTime() }))
  ].sort((a, b) => b.order - a.order);
  return `<div class="page-head"><div><div class="eyebrow">Uma jornada feita de relações</div><h1>Mapa de repertório</h1><p class="lead">Uma visão qualitativa do que você explorou, testou e ainda quer entender. O caminho não precisa ser linear.</p></div><div class="actions"><button class="btn btn-ghost" data-action="export-md">Exportar .md ${icon('download')}</button><button class="btn" data-action="export-json">Backup .json ${icon('download')}</button></div></div><div class="split"><section class="card"><div class="card-kicker">Pilares em movimento</div><h2 style="margin-top:7px">Um mapa, não uma nota.</h2><p class="tiny">As barras acompanham ciclos concluídos. Cada trilha tem seu próprio começo e ritmo.</p>${values.map(({ track, done }) => `<div class="bar-row"><span>${esc(track.pillar)}</span><div class="progress-line"><span style="width:${Math.round(done / max * 100)}%"></span></div><strong>${done}/${track.lessons.length}</strong></div>`).join('')}</section><section class="card card-lime"><div class="card-kicker">O seu jeito de seguir</div><h2 style="margin-top:7px">${state.experiments.length} experimentos · ${state.notes.length} anotações</h2><p style="color:var(--ink)">O repertório cresce quando você conecta ideias, observa o que muda e volta às perguntas que ficaram abertas.</p><a class="btn btn-ghost btn-small" href="#caderno">Retomar uma pergunta ${icon('arrow')}</a></section></div><div class="section-label"><h2>Linha do tempo</h2><span class="tiny">Experimentos · perguntas · conexões</span></div>${items.length ? `<div class="card"><div class="timeline">${items.map(item => `<article class="timeline-item"><div class="card-kicker">${esc(item.type)} · ${dateLabel(item.date)}</div><strong>${esc(item.title || 'Um novo passo')}</strong><p>${esc(item.text || 'Um registro no seu caminho.')}</p></article>`).join('')}</div></div>` : `<div class="empty">${icon('map')}<h3>Seu mapa começa com uma tentativa.</h3><p>Explore uma aula, registre um experimento ou guarde uma pergunta para abrir a sua linha do tempo.</p><a class="btn btn-small" href="#trilhas">Escolher uma trilha ${icon('arrow')}</a></div>`}`;
}

function communityView(state) {
  const posts = state.posts.filter(post => communityFilter === 'all' || post.trackId === communityFilter);
  return `<div class="page-head"><div><div class="eyebrow">Uma conversa com espaço para tentar</div><h1>Roda de conversa</h1><p class="lead">Compartilhe uma tentativa ou deixe uma pergunta em aberto. Você pode conversar sem ter uma resposta pronta.</p></div></div><form data-form="post" class="card card-soft"><div class="card-kicker">Uma ideia para compartilhar</div><div class="community-compose" style="margin-top:12px"><div class="field"><label class="sr-only" for="post-text">Escreva uma tentativa ou pergunta</label><textarea id="post-text" name="text" class="short" required maxlength="700" placeholder="O que você experimentou? Que pergunta continua com você?"></textarea></div><button class="btn" type="submit">Publicar ${icon('arrow')}</button></div><div class="form-grid" style="margin-top:11px"><div class="field" style="margin:0"><label class="sr-only" for="post-kind">Tipo de publicação</label><select id="post-kind" name="kind"><option value="pergunta">Pergunta aberta</option><option value="tentativa">Tentativa</option></select></div><div class="field" style="margin:0"><label class="sr-only" for="post-track">Trilha</label><select id="post-track" name="trackId"><option value="">Sem trilha</option>${tracks.map(track => `<option value="${track.id}">${esc(track.name)}</option>`).join('')}</select></div></div><div class="tiny" style="margin-top:10px">Publique apenas o que você se sente à vontade em compartilhar neste navegador.</div></form><div class="section-label"><h2>Conversas recentes</h2><select id="community-filter" aria-label="Filtrar publicações por trilha"><option value="all">Todas as trilhas</option>${tracks.map(track => `<option value="${track.id}" ${communityFilter === track.id ? 'selected' : ''}>${esc(track.name)}</option>`).join('')}</select></div><div class="stack">${posts.length ? posts.map(post => `<article class="card post"><div class="post-head"><span class="avatar">${esc(initials(post.author))}</span><div class="post-meta"><strong>${esc(post.author)}</strong><small>${dateLabel(post.createdAt)} · ${esc(trackById(post.trackId)?.name || 'Comunidade')}</small></div><span class="badge">${post.kind === 'tentativa' ? 'Tentativa' : 'Pergunta aberta'}</span></div><p class="post-text">${esc(post.text)}</p>${(post.replies || []).map(reply => `<div class="reply"><strong>${esc(reply.author)}:</strong> ${esc(reply.text)}</div>`).join('')}<form class="post-reply" data-form="reply" data-post="${esc(post.id)}"><label class="sr-only" for="reply-${esc(post.id)}">Responder a ${esc(post.author)}</label><input id="reply-${esc(post.id)}" name="text" required maxlength="350" placeholder="Escreva uma resposta acolhedora…"><button class="btn btn-small" type="submit">Responder</button></form></article>`).join('') : `<div class="empty">Não há publicações nesta trilha. Se quiser, abra a conversa com uma pergunta.</div>`}</div>`;
}

function showWelcome() {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">${brandMark}<div class="eyebrow">Um começo possível</div><h2 id="welcome-title">Boas-vindas ao seu espaço.</h2><p>Conte só o necessário para personalizar seu caminho. Você pode mudar de ideia a qualquer momento.</p><form data-form="welcome"><div class="field"><label for="welcome-name">Como podemos chamar você?</label><input id="welcome-name" name="name" autocomplete="given-name" placeholder="Seu nome"></div><fieldset style="border:0;padding:0;margin:0"><legend class="field label" style="font-size:.78rem;font-weight:700;margin-bottom:8px">Qual trilha desperta mais curiosidade hoje?</legend><div class="choice-list">${tracks.map((track, index) => `<label class="choice"><input type="radio" name="favoriteTrack" value="${track.id}" ${index === 0 ? 'checked' : ''}><span>${esc(track.name)}</span></label>`).join('')}</div></fieldset><div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="skip-welcome">Explorar sem configurar</button><button class="btn" type="submit">Abrir meu espaço ${icon('arrow')}</button></div></form></section></div>`;
  modalRoot.querySelector('#welcome-name')?.focus();
}

function settingsModal(profile) {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div class="eyebrow">Seu espaço local</div><h2 id="settings-title">Configurações</h2><p>Seu perfil e registros ficam salvos neste navegador.</p><form data-form="settings"><div class="field"><label for="settings-name">Seu nome</label><input id="settings-name" name="name" value="${esc(profile?.name || '')}" placeholder="Seu nome"></div><div class="field"><label for="settings-track">Trilha que desperta curiosidade</label><select id="settings-track" name="favoriteTrack"><option value="">Escolher depois</option>${tracks.map(track => `<option value="${track.id}" ${profile?.favoriteTrack === track.id ? 'selected' : ''}>${esc(track.name)}</option>`).join('')}</select></div><div class="modal-actions" style="justify-content:space-between"><button class="btn btn-danger btn-small" type="button" data-action="reset-data">Apagar dados locais</button><div class="actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancelar</button><button class="btn" type="submit">Salvar</button></div></div></form></section></div>`;
}

function toast(message) {
  document.querySelector('.toast')?.remove();
  const node = document.createElement('div'); node.className = 'toast'; node.textContent = message;
  document.body.append(node); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.remove(), 2700);
}

async function refresh() { await render(); }

function bindViewEvents() {
  app.onclick = async event => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'settings') { settingsModal(await store.getProfile()); return; }
    if (action === 'close-modal') { if (event.target === target || target.tagName === 'BUTTON') modalRoot.innerHTML = ''; return; }
    if (action === 'skip-welcome') { modalRoot.innerHTML = ''; return; }
    if (action === 'open-lesson' || action === 'resume') {
      event.preventDefault();
      const trackId = target.dataset.track || path().slug;
      currentLessonId = target.dataset.lesson || null; currentStep = 0;
      activeTrackId = trackId;
      if (currentLessonId) await store.markExplored(currentLessonId);
      if (path().route !== 'trilha' || path().slug !== trackId) location.hash = `#trilha/${trackId}`;
      else await refresh();
      return;
    }
    if (action === 'step') { currentStep = Number(target.dataset.step); await refresh(); return; }
    if (action === 'save-excerpt') {
      const lesson = findLesson(target.dataset.lesson); if (!lesson) return;
      await store.saveNote({ id: `excerpt-${lesson.id}`, title: `Trecho · ${lesson.title}`, trackId: lesson.trackId, body: `“${lesson.excerpt}”\n\n${lesson.idea}`, question: '' });
      selectedNoteId = `excerpt-${lesson.id}`; toast('Trecho enviado ao Caderno.'); return;
    }
    if (action === 'save-experiment') {
      const lesson = findLesson(target.dataset.lesson); const field = document.querySelector('#experiment-note'); const body = safeText(field?.value);
      if (!body) { toast('Registre uma observação antes de salvar.'); field?.focus(); return; }
      await store.saveExperiment({ lessonId: lesson.id, lessonTitle: lesson.title, trackId: target.dataset.track, body });
      toast('Experimento registrado no seu caminho.'); await refresh(); return;
    }
    if (action === 'complete-lesson') {
      const lesson = findLesson(target.dataset.lesson); await store.completeLesson(target.dataset.lesson);
      currentLessonId = null; currentStep = 0; toast('Ciclo concluído. Você pode voltar a ele quando quiser.'); await refresh(); return;
    }
    if (action === 'new-note') {
      const id = await store.saveNote({ title: '', trackId: '', body: '', nextQuestion: '' }); selectedNoteId = id; await refresh(); document.querySelector('#note-title')?.focus(); return;
    }
    if (action === 'select-note') { selectedNoteId = target.dataset.note; await refresh(); return; }
    if (action === 'delete-note') {
      if (!confirm('Apagar esta anotação do seu caderno?')) return;
      await store.deleteNote(target.dataset.note); selectedNoteId = null; toast('Anotação apagada.'); await refresh(); return;
    }
    if (action === 'export-md') { await exportMarkdown(); return; }
    if (action === 'export-json') { download('vertice-repertorio.json', await store.exportJSON(), 'application/json;charset=utf-8'); toast('Backup JSON preparado.'); return; }
    if (action === 'lab-toggle') { toggleTimer(); await refresh(); return; }
    if (action === 'lab-next') { advanceLab(); await refresh(); return; }
    if (action === 'lab-go') { stopTimer(); lab.phase = Number(target.dataset.phase); lab.remaining = [60, 120, 120][lab.phase]; await refresh(); return; }
    if (action === 'save-lab-note') {
      const question = safeText(document.querySelector('#lab-question')?.value);
      if (!question) { document.querySelector('#lab-question')?.focus(); toast('Escreva uma pergunta para guardar.'); return; }
      lab.question = question;
      const id = await store.saveNote({ title: 'Feche o texto. Abra uma pergunta.', trackId: '', body: `Texto escolhido: ${sampleTexts.find(item => item.id === lab.textId)?.label || 'Texto próprio'}\n\nMinha explicação:\n${lab.explanation}`, nextQuestion: question });
      selectedNoteId = id; toast('Sua pergunta ficou guardada no Caderno.'); location.hash = '#caderno'; return;
    }
    if (action === 'save-lab-experiment') {
      await store.saveExperiment({ lessonTitle: 'Laboratório · recuperação ativa', trackId: '', body: lab.explanation || 'Prática de recuperação ativa realizada.' });
      toast('Prática registrada no seu repertório.'); await refresh(); return;
    }
    if (action === 'reset-data') {
      if (!confirm('Apagar o perfil, as anotações, o progresso e as publicações salvas neste navegador?')) return;
      await store.reset(); selectedNoteId = null; currentLessonId = null; noteSearch = ''; noteFilter = 'all'; communityFilter = 'all'; modalRoot.innerHTML = ''; await refresh(); return;
    }
  };

  app.onsubmit = async event => {
    const form = event.target.closest('form[data-form]'); if (!form) return;
    event.preventDefault(); const data = Object.fromEntries(new FormData(form).entries());
    if (form.dataset.form === 'welcome') {
      const name = safeText(data.name);
      if (name) await store.saveProfile({ name, favoriteTrack: data.favoriteTrack || '' });
      modalRoot.innerHTML = ''; await refresh(); return;
    }
    if (form.dataset.form === 'settings') {
      await store.saveProfile({ name: safeText(data.name), favoriteTrack: data.favoriteTrack || '' });
      modalRoot.innerHTML = ''; toast('Perfil atualizado.'); await refresh(); return;
    }
    if (form.dataset.form === 'note') {
      const id = await store.saveNote({ id: form.dataset.note, ...data }); selectedNoteId = id; toast('Anotação salva.'); await refresh(); return;
    }
    if (form.dataset.form === 'connect-note') {
      await store.connectNotes(data.from, data.to, safeText(data.label)); toast('Conexão adicionada ao seu mapa.'); await refresh(); return;
    }
    if (form.dataset.form === 'post') {
      const text = safeText(data.text); if (!text) return;
      await store.addPost({ text, kind: data.kind, trackId: data.trackId || '' }); toast('Publicação adicionada à conversa.'); await refresh(); return;
    }
    if (form.dataset.form === 'reply') {
      await store.addReply(form.dataset.post, safeText(data.text)); toast('Resposta adicionada.'); await refresh(); return;
    }
  };

  app.oninput = event => {
    const target = event.target;
    if (target.matches('#note-search')) {
      noteSearch = target.value;
      store.getState().then(state => {
        const filtered = state.notes.filter(item => (noteFilter === 'all' || item.trackId === noteFilter) && `${item.title} ${item.body} ${item.question} ${item.nextQuestion}`.toLocaleLowerCase('pt-BR').includes(noteSearch.toLocaleLowerCase('pt-BR')));
        const selected = state.notes.find(item => item.id === selectedNoteId);
        const container = document.querySelector('#note-list-container'); if (!container) return;
        container.innerHTML = `<div class="note-list">${filtered.length ? filtered.map(item => `<button class="note-item ${item.id === selected?.id ? 'selected' : ''}" data-action="select-note" data-note="${esc(item.id)}"><strong>${esc(item.title || 'Anotação sem título')}</strong><small>${esc(trackById(item.trackId)?.name || 'Anotação livre')} · ${dateLabel(item.updatedAt || item.createdAt)}</small><small style="display:block;margin-top:5px">${esc((item.body || item.question || item.nextQuestion || 'Sem texto').slice(0, 78))}</small></button>`).join('') : '<div class="empty">Nenhuma anotação encontrada.</div>'}</div>`;
      });
    }
    if (target.matches('#lesson-question')) {
      const lesson = findLesson(target.dataset.autoQuestion); if (!lesson) return;
      const status = document.querySelector('#autosave-status'); if (status) status.textContent = 'Salvando…';
      clearTimeout(lessonSaveTimer);
      lessonSaveTimer = setTimeout(async () => {
        const question = safeText(target.value);
        await store.saveNote({ id: `lesson-question-${lesson.id}`, title: `Pergunta · ${lesson.title}`, trackId: lesson.trackId, body: '', question });
        if (status?.isConnected) status.textContent = 'Pergunta salva no Caderno.';
      }, 350);
    }
    if (target.matches('#lab-explanation')) lab.explanation = target.value;
    if (target.matches('#lab-question')) lab.question = target.value;
    if (target.matches('#custom-reading')) lab.customText = target.value;
  };
  app.onchange = event => {
    const target = event.target;
    if (target.matches('#note-filter')) { noteFilter = target.value; refresh(); }
    if (target.matches('#community-filter')) { communityFilter = target.value; refresh(); }
    if (target.matches('#sample-select')) { lab.textId = target.value; refresh(); }
    if (target.matches('#custom-reading')) lab.customText = target.value;
  };

  modalRoot.onclick = async event => {
    const target = event.target.closest('[data-action]'); if (!target) return;
    if (target.dataset.action === 'skip-welcome') { modalRoot.innerHTML = ''; return; }
    if (target.dataset.action === 'close-modal' && (event.target === target || target.tagName === 'BUTTON')) { modalRoot.innerHTML = ''; return; }
    if (target.dataset.action === 'reset-data') {
      if (!confirm('Apagar o perfil, as anotações, o progresso e as publicações salvas neste navegador?')) return;
      await store.reset(); selectedNoteId = null; currentLessonId = null; noteSearch = ''; noteFilter = 'all'; communityFilter = 'all'; modalRoot.innerHTML = ''; await refresh(); return;
    }
  };
  modalRoot.onsubmit = async event => {
    const form = event.target.closest('form[data-form]'); if (!form) return;
    event.preventDefault(); const data = Object.fromEntries(new FormData(form).entries());
    if (form.dataset.form === 'welcome') {
      const name = safeText(data.name); if (name) await store.saveProfile({ name, favoriteTrack: data.favoriteTrack || '' });
      modalRoot.innerHTML = ''; await refresh(); return;
    }
    if (form.dataset.form === 'settings') {
      await store.saveProfile({ name: safeText(data.name), favoriteTrack: data.favoriteTrack || '' });
      modalRoot.innerHTML = ''; toast('Perfil atualizado.'); await refresh();
    }
  };
}

function stopTimer() {
  if (lab.interval) clearInterval(lab.interval);
  lab.interval = null; lab.running = false;
}
function advanceLab() {
  stopTimer();
  if (lab.phase < 2) { lab.phase += 1; lab.remaining = [60, 120, 120][lab.phase]; }
  else { lab.phase = 0; lab.remaining = 60; lab.explanation = ''; lab.question = ''; }
}
function toggleTimer() {
  if (lab.running) { stopTimer(); return; }
  if (lab.phase >= 2) return;
  lab.running = true;
  lab.interval = setInterval(() => {
    if (lab.remaining > 1) { lab.remaining -= 1; const clock = document.querySelector('.lab-clock'); const trackBar = document.querySelector('.timer-track span'); if (clock) clock.textContent = formatTime(lab.remaining); if (trackBar) trackBar.style.width = `${100 * (1 - lab.remaining / [60, 120, 120][lab.phase])}%`; return; }
    if (lab.phase < 2) { lab.phase += 1; lab.remaining = [60, 120, 120][lab.phase]; render(); }
    else { stopTimer(); lab.remaining = 0; render(); }
  }, 1000);
}

function download(filename, content, type) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
}
async function exportMarkdown() {
  const state = await store.getState();
  const lines = ['# Meu repertório Vértice', '', `Exportado em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}`, ''];
  lines.push('## Anotações', '');
  if (!state.notes.length) lines.push('_Ainda não há anotações._', '');
  state.notes.forEach(note => { lines.push(`### ${note.title || 'Anotação sem título'}`, '', `Trilha: ${trackById(note.trackId)?.name || 'Livre'}`, '', note.body || '', note.question || note.nextQuestion ? `**Pergunta para retomar:** ${note.question || note.nextQuestion}` : '', ''); });
  lines.push('## Experimentos', '');
  if (!state.experiments.length) lines.push('_Ainda não há experimentos registrados._', '');
  state.experiments.forEach(item => lines.push(`- ${dateLabel(item.createdAt)} · ${item.lessonTitle || trackById(item.trackId)?.name || 'Experimento'}: ${item.body}`));
  lines.push('', '## Perguntas em aberto', '');
  state.notes.filter(note => note.question || note.nextQuestion).forEach(note => lines.push(`- ${note.question || note.nextQuestion}`));
  download('vertice-repertorio.md', lines.join('\n'), 'text/markdown;charset=utf-8'); toast('Repertório Markdown preparado.');
}

window.addEventListener('hashchange', () => { const next = path(); if (next.route !== 'trilha' || next.slug !== activeTrackId) { currentLessonId = null; currentStep = 0; } render(); });
window.addEventListener('storage', event => { if (event.key === 'vertice.app.v1') render(); });
render();

