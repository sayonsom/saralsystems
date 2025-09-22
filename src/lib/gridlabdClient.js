import { apiFetch } from './api';

// Users API
export const users = {
  lookup: async (emails = [], opts = {}) => {
    return apiFetch('/api/users/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify({ emails }),
      forceLocal: true,
      ...opts
    });
  },
};

// Projects API
export const projects = {
  // Create a new project
  create: async (data, opts = {}) => {
    return apiFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },
  // Back-compat alias
  createProject: async (data, opts = {}) => projects.create(data, opts),

  // List user's projects
  list: async (params = {}, opts = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/projects?${searchParams.toString()}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },
  // Back-compat alias
  listProjects: async (params = {}, opts = {}) => projects.list(params, opts),

  // Get project details
  get: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Update project
  update: async (projectId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // Delete project (hard delete)
  delete: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      ...opts,
      headers: { ...opts.headers }
    });
  },
  // Back-compat alias
  deleteProject: async (projectId, opts = {}) => projects.delete(projectId, opts),

  // Share project with recipients (supports optional message and expiry). Accepts emails or user_ids.
  share: async (projectId, payload = {}, opts = {}) => {
    const { emails = [], user_ids = [], message = '', expires_in = 86400, role = 'viewer' } = payload || {};
    let userIds = Array.isArray(user_ids) ? [...user_ids] : [];

    // If user_ids not provided, try to resolve emails to ids via lookup
    if ((!userIds || userIds.length === 0) && emails?.length) {
      try {
        const lookup = await users.lookup(emails, opts);
        const mapped = Array.isArray(lookup?.users) ? lookup.users : [];
        userIds = mapped.filter(u => u.exists && u.id).map(u => u.id);
      } catch (e) {
        // proceed with emails as invites
      }
    }

    return apiFetch(`/api/projects/${projectId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify({ user_ids: userIds, emails, message, expires_in, role }),
      forceLocal: true,
      ...opts
    });
  },

  // Bulk share helper
  shareBulk: async ({ project_ids = [], emails = [], user_ids = [], message = '', expires_in = 86400, role = 'viewer' }, opts = {}) => {
    let userIds = Array.isArray(user_ids) ? [...user_ids] : [];
    if ((!userIds || userIds.length === 0) && emails?.length) {
      try {
        const lookup = await users.lookup(emails, opts);
        const mapped = Array.isArray(lookup?.users) ? lookup.users : [];
        userIds = mapped.filter(u => u.exists && u.id).map(u => u.id);
      } catch {}
    }
    return apiFetch('/api/projects/share/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify({ project_ids, user_ids: userIds, emails, message, expires_in, role }),
      forceLocal: true,
      ...opts
    });
  },

  // List simulations for a project
  listSimulations: async (projectId, params = {}, opts = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/projects/${projectId}/simulations?${searchParams.toString()}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Files: Create a new file
  createFile: async (projectId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // List files in project
  listFiles: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Get file content
  getFile: async (projectId, fileId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Update file content
  updateFile: async (projectId, fileId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // Delete file
  deleteFile: async (projectId, fileId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE',
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Update file metadata (rename, type)
  updateMetadata: async (projectId, fileId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}/metadata`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // Bulk save files
  bulkSave: async (projectId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // Bulk delete files
  bulkDelete: async (projectId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // File versions: Create version
  createVersion: async (projectId, fileId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // List file versions
  listVersions: async (projectId, fileId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}/versions`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Get specific version
  getVersion: async (projectId, fileId, versionId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/files/${fileId}/versions/${versionId}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Tags: Create project tag/snapshot
  createTag: async (projectId, data, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // List project tags
  listTags: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/tags`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Get project tag
  getTag: async (projectId, tagId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/tags/${tagId}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Delete project tag
  deleteTag: async (projectId, tagId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/tags/${tagId}`, {
      method: 'DELETE',
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // === New: Filter & state transitions ===
  // List projects shared with current user (not trashed)
  shared: async (opts = {}) => {
    return apiFetch('/api/projects/shared', {
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },

  // List archived projects (owned by user)
  archived: async (opts = {}) => {
    return apiFetch('/api/projects/archived', {
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },

  // List trashed projects (owned by user)
  trashed: async (opts = {}) => {
    return apiFetch('/api/projects/trashed', {
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },

  // General filter with view/tag/q
  filter: async ({ view, tag, q } = {}, opts = {}) => {
    const sp = new URLSearchParams();
    if (view) sp.set('view', view);
    if (tag) sp.set('tag', tag);
    if (q) sp.set('q', q);
    return apiFetch(`/api/projects/filter?${sp.toString()}`.replace(/\?$/, ''), {
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },

  // State transitions
  archive: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/archive`, {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },
  unarchive: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/unarchive`, {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },
  trash: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/trash`, {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },
  restore: async (projectId, opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/restore`, {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers },
      forceLocal: true
    });
  },

  // Set tags array on a project
  setTags: async (projectId, tags = [], opts = {}) => {
    return apiFetch(`/api/projects/${projectId}/tags:set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify({ tags }),
      forceLocal: true,
      ...opts
    });
  }
};

// Simulations API
export const simulations = {
  // Start a new simulation (standard run)
  create: async (data, opts = {}) => {
    return apiFetch('/api/simulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify(data),
      ...opts
    });
  },

  // List simulations
  list: async (params = {}, opts = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/simulations?${searchParams.toString()}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Run simulation from archive (multipart)
  archive: async (formData, opts = {}) => {
    // formData should include 'project_id', 'file' (zip blob), 'main_filename', 'name'
    return apiFetch('/api/simulations/archive', {
      method: 'POST',
      body: formData,
      ...opts
      // No Content-Type for FormData, let browser set it
    });
  },

  // Get simulation status
  get: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Cancel simulation
  cancel: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}`, {
      method: 'DELETE',
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Get simulation console output
  console: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/console`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // List simulation output files
  listFiles: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/files`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Download specific output file
  getFile: async (simulationId, filename, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/files/${filename}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Download outputs as zip
  outputsZip: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/outputs`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Health check
  health: async (opts = {}) => {
    return apiFetch('/api/simulations/health', {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Diagnostics
  diagnostics: async (opts = {}) => {
    return apiFetch('/api/simulations/diagnostics', {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // List running simulations (debug)
  running: async (opts = {}) => {
    return apiFetch('/api/simulations/status/running', {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Force complete (admin)
  forceComplete: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/force-complete`, {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Debug info
  debug: async (simulationId, opts = {}) => {
    return apiFetch(`/api/simulations/${simulationId}/debug`, {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Monitor stats
  monitorStats: async (opts = {}) => {
    return apiFetch('/api/simulations/monitor/stats', {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Start monitor
  startMonitor: async (opts = {}) => {
    return apiFetch('/api/simulations/monitor/start', {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Cleanup stuck
  cleanup: async (opts = {}) => {
    return apiFetch('/api/simulations/monitor/cleanup', {
      method: 'POST',
      ...opts,
      headers: { ...opts.headers }
    });
  }
};

// User API
export const user = {
  // Get user profile
  profile: async (opts = {}) => {
    return apiFetch('/api/user/profile', {
      ...opts,
      headers: { ...opts.headers }
    });
  },

  // Get user simulations
  simulations: async (params = {}, opts = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/user/simulations?${searchParams.toString()}`, {
      ...opts,
      headers: { ...opts.headers }
    });
  }
};

// Health endpoints
export const health = {
  root: async () => apiFetch('/'),
  health: async () => apiFetch('/health'),
  db: async () => apiFetch('/api/health/db'),
  details: async () => apiFetch('/health/details'),
  ready: async () => apiFetch('/ready'),
  debugEnv: async () => apiFetch('/api/debug/env')
};
