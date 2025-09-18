// Simple client-side projects service for VoltEdge tool
// Stores projects in localStorage per-user. Replace with Firestore later.

export function getStorageKey(uid) {
  return `gridlabd:projects:${uid}`;
}

export function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function listProjects(uid) {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(getStorageKey(uid));
  const arr = safeParse(raw, []);
  // Normalize shape
  return Array.isArray(arr) ? arr : [];
}

export function saveProjects(uid, projects) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(uid), JSON.stringify(projects));
}

export function createProject(uid, data) {
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
  const now = new Date().toISOString();
  const project = {
    id,
    name: data?.name?.trim() || 'Untitled Project',
    description: data?.description?.trim() || '',
    template: data?.template || 'Blank Project',
    owner: uid,
    status: 'success',
    lastModified: now,
    shared: false,
    sharedWith: '',
  };
  const existing = listProjects(uid);
  const next = [project, ...existing];
  saveProjects(uid, next);
  // Initialize local workspace storage
  try {
    localStorage.setItem(`projects.${id}.files`, JSON.stringify([
      { filename: 'main.glm', content: '' },
    ]));
    localStorage.setItem(`projects.${id}.mainFilename`, 'main.glm');
  } catch {}
  return project;
}

export function updateProject(uid, id, patch) {
  const list = listProjects(uid);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated = { ...list[idx], ...patch, lastModified: now };
  const next = [...list];
  next[idx] = updated;
  saveProjects(uid, next);
  return updated;
}

export function removeProjects(uid, ids) {
  const set = new Set(ids);
  const list = listProjects(uid);
  const next = list.filter(p => !set.has(p.id));
  saveProjects(uid, next);
  return next;
}

export function getProjectFiles(projectId) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`projects.${projectId}.files`);
    return safeParse(raw, []);
  } catch { return []; }
}

export function saveProjectFiles(projectId, files) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`projects.${projectId}.files`, JSON.stringify(files || []));
  } catch {}
}

export function getMainFilename(projectId) {
  if (typeof window === 'undefined') return 'main.glm';
  try { return localStorage.getItem(`projects.${projectId}.mainFilename`) || 'main.glm'; } catch { return 'main.glm'; }
}

export function setMainFilename(projectId, main) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`projects.${projectId}.mainFilename`, main || 'main.glm'); } catch {}
}
