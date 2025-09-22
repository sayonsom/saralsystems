// Client helpers for future profile/account endpoints.
// Each method documents expected backend contract.
import { apiFetch } from './api';

export const userClient = {
  // GET /api/user/profile -> { uid, name, email, company, website, providers:[], createdAt }
  profile: async () => apiFetch('/api/user/profile'),

  // PATCH /api/user/profile  body: { name?, company?, website? } -> updated profile
  updateProfile: async (data) => apiFetch('/api/user/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  // POST /api/user/api-keys  body: { label? } -> { key: 'sk_live_xxx', id, createdAt, lastUsed:null }
  createApiKey: async (data={}) => apiFetch('/api/user/api-keys', { method: 'POST', body: JSON.stringify(data) }),

  // GET /api/user/api-keys -> [{ id, prefix, createdAt, lastUsed, status }]
  listApiKeys: async () => apiFetch('/api/user/api-keys'),

  // DELETE /api/user/api-keys/:id -> { revoked: true }
  revokeApiKey: async (id) => apiFetch(`/api/user/api-keys/${id}`, { method: 'DELETE' }),

  // POST /api/user/password  body: { currentPassword, newPassword } -> { success:true }
  changePassword: async (data) => apiFetch('/api/user/password', { method: 'POST', body: JSON.stringify(data) }),

  // POST /api/user/oauth/google/link  body: { idToken } -> { linked:true }
  linkGoogle: async (idToken) => apiFetch('/api/user/oauth/google/link', { method: 'POST', body: JSON.stringify({ idToken }) }),

  // POST /api/user/oauth/google/unlink -> { unlinked:true }
  unlinkGoogle: async () => apiFetch('/api/user/oauth/google/unlink', { method: 'POST' })
};
