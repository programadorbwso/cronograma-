import { weeklyMinutes, validMinutes, validState } from './model.mjs';
const key = 'ritmo-studies-v1';
let state = { subjects: [], sessions: [] };
const $ = selector => document.querySelector(selector);
try { const raw = localStorage.getItem(key); if (raw) { const data = JSON.parse(raw); if (!validState(data)) throw Error(); state = data; } } catch { $('#storage-warning').textContent = 'Não foi possível carregar os dados salvos. Verifique as permissões de armazenamento do navegador.'; }
function save() { try { localStorage.setItem(key, JSON.stringify(state)); } catch { $('#storage-warning').textContent = 'Não foi possível salvar. Seus registros atuais podem se perder ao fechar a página.'; } render(); }
function element(tag, text, className) { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; }
function render() {
  const now = new Date();
  const totals = state.subjects.map(s => weeklyMinutes(s, state.sessions, now));
  $('#total').textContent = `${totals.reduce((a, b) => a + b, 0)} min`;
  $('#completed').textContent = `${state.subjects.filter((s, i) => totals[i] >= s.goal).length} / ${state.subjects.length}`;
  $('#count').textContent = state.subjects.length;
  $('#empty').hidden = state.subjects.length > 0;
  $('#subjects').replaceChildren();
  state.subjects.forEach((subject, i) => {
    const card = element('article', '', 'subject');
    const heading = element('div', '', 'subject-heading');
    heading.append(element('h3', subject.name));
    const remove = element('button', 'Remover', 'remove'); remove.type = 'button'; remove.setAttribute('aria-label', `Remover ${subject.name}`);
    remove.onclick = () => { if (confirm(`Remover ${subject.name} e seu histórico?`)) { state.subjects = state.subjects.filter(s => s.id !== subject.id); state.sessions = state.sessions.filter(s => s.subjectId !== subject.id); save(); } };
    heading.append(remove); card.append(heading);
    card.append(element('p', `${totals[i]} de ${subject.goal} min nesta semana`, 'muted'));
    const progress = document.createElement('progress'); progress.max = subject.goal; progress.value = Math.min(totals[i], subject.goal); progress.setAttribute('aria-label', `Progresso de ${subject.name}`); card.append(progress);
    const form = document.createElement('form'); form.className = 'session-form';
    const input = document.createElement('input'); input.type = 'number'; input.min = '1'; input.max = '1440'; input.required = true; input.placeholder = 'Minutos estudados'; input.setAttribute('aria-label', `Minutos estudados em ${subject.name}`);
    const button = element('button', 'Registrar sessão'); button.type = 'submit'; form.append(input, button);
    form.onsubmit = e => { e.preventDefault(); const minutes = Number(input.value); if (!validMinutes(minutes)) return; state.sessions.push({ subjectId: subject.id, minutes, at: new Date().toISOString() }); save(); }; card.append(form); $('#subjects').append(card);
  });
  $('#history').replaceChildren(); $('#no-history').hidden = state.sessions.length > 0;
  state.sessions.slice(-10).reverse().forEach(s => { const subject = state.subjects.find(x => x.id === s.subjectId); const li = element('li', ''); li.append(element('strong', subject?.name || 'Matéria removida'), element('span', `${s.minutes} min · ${new Date(s.at).toLocaleString('pt-BR', {dateStyle:'short',timeStyle:'short'})}`)); $('#history').append(li); });
}
$('#subject-form').onsubmit = e => { e.preventDefault(); const name = $('#name').value.trim(); const goal = Number($('#goal').value); if (!name || !validMinutes(goal, 10080)) return; state.subjects.push({id: crypto.randomUUID(), name, goal}); e.target.reset(); save(); $('#name').focus(); };
render();
