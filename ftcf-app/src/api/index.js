export { api } from './client';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (email, password) => import('./client').then(m => m.api.post('/auth/login', { email, password })),
  me:             ()                => import('./client').then(m => m.api.get('/auth/me')),
  changePassword: (body)            => import('./client').then(m => m.api.put('/auth/change-password', body)),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll:   (params = {}) => import('./client').then(m => m.api.get(`/users?${new URLSearchParams(params)}`)),
  getById:  (id)          => import('./client').then(m => m.api.get(`/users/${id}`)),
  update:   (id, body)    => import('./client').then(m => m.api.put(`/users/${id}`, body)),
  create:   (body)        => import('./client').then(m => m.api.post('/users', body)),
  delete:   (id)          => import('./client').then(m => m.api.delete(`/users/${id}`)),
};

// ── Trainings ─────────────────────────────────────────────────────────────────
export const trainingsApi = {
  getAll:  (params = {}) => import('./client').then(m => m.api.get(`/trainings?${new URLSearchParams(params)}`)),
  getById: (id)          => import('./client').then(m => m.api.get(`/trainings/${id}`)),
  create:  (body)        => import('./client').then(m => m.api.post('/trainings', body)),
  update:  (id, body)    => import('./client').then(m => m.api.put(`/trainings/${id}`, body)),
  delete:  (id)          => import('./client').then(m => m.api.delete(`/trainings/${id}`)),
};

// ── Registrations ─────────────────────────────────────────────────────────────
export const registrationsApi = {
  getAll:       (params = {}) => import('./client').then(m => m.api.get(`/registrations?${new URLSearchParams(params)}`)),
  register:     (body)        => import('./client').then(m => m.api.post('/registrations', body)),
  updateStatus: (id, body)    => import('./client').then(m => m.api.put(`/registrations/${id}/status`, body)),
  withdraw:     (id)          => import('./client').then(m => m.api.delete(`/registrations/${id}`)),
};

// ── Certificates ──────────────────────────────────────────────────────────────
export const certificatesApi = {
  getAll:  (params = {}) => import('./client').then(m => m.api.get(`/certificates?${new URLSearchParams(params)}`)),
  upload:  (formData)    => import('./client').then(m => m.api.upload('/certificates', formData)),
  verify:  (id, body)    => import('./client').then(m => m.api.put(`/certificates/${id}/verify`, body)),
};

// ── Credit History ────────────────────────────────────────────────────────────
export const creditsApi = {
  getAll: (params = {}) => import('./client').then(m => m.api.get(`/credits?${new URLSearchParams(params)}`)),
};

// ── Attendance ────────────────────────────────────────────────────────────────
export const attendanceApi = {
  getAll:   (params = {}) => import('./client').then(m => m.api.get(`/attendance?${new URLSearchParams(params)}`)),
  saveBulk: (body)        => import('./client').then(m => m.api.post('/attendance/bulk', body)),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsApi = {
  system:        () => import('./client').then(m => m.api.get('/stats/system')),
  departments:   () => import('./client').then(m => m.api.get('/stats/departments')),
  monthlyTrends: () => import('./client').then(m => m.api.get('/stats/monthly-trends')),
  faculty:       (id) => import('./client').then(m => m.api.get(`/stats/faculty/${id}`)),
};
