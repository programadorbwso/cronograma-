export function weekStart(now = new Date()) {
  const d = new Date(now); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d;
}
export function weeklyMinutes(subject, sessions, now = new Date()) {
  return sessions.filter(s => s.subjectId === subject.id && new Date(s.at) >= weekStart(now) && new Date(s.at) <= now).reduce((n, s) => n + s.minutes, 0);
}
export function validMinutes(value, max = 1440) {
  return Number.isInteger(value) && value > 0 && value <= max;
}
export function validState(data) {
  return data && Array.isArray(data.subjects) && Array.isArray(data.sessions) && data.subjects.every(s => typeof s.id === 'string' && typeof s.name === 'string' && s.name.trim() && validMinutes(s.goal, 10080)) && data.sessions.every(s => typeof s.subjectId === 'string' && validMinutes(s.minutes) && Number.isFinite(Date.parse(s.at)));
}
