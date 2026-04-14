const API_BASE = import.meta.env.VITE_API_URL || 'https://destinationwedding-crm.onrender.com';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Enquiries
export const enquiryAPI = {
  getAll: () => request('/api/enquiries'),
  getOne: (id) => request(`/api/enquiries/${id}`),
  create: (data) => request('/api/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/api/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addFollowUp: (id, followUp) => request(`/api/enquiries/${id}/follow-ups`, { method: 'POST', body: JSON.stringify(followUp) }),
  delete: (id) => request(`/api/enquiries/${id}`, { method: 'DELETE' }),
};

// Clients
export const clientAPI = {
  getAll: () => request('/api/clients'),
  getOne: (id) => request(`/api/clients/${id}`),
  convert: (enquiryId) => request(`/api/clients/convert/${enquiryId}`, { method: 'POST' }),
  update: (id, data) => request(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addPayment: (id, payment) => request(`/api/clients/${id}/payments`, { method: 'POST', body: JSON.stringify(payment) }),
  addEvent: (id, event) => request(`/api/clients/${id}/events`, { method: 'POST', body: JSON.stringify(event) }),
  delete: (id) => request(`/api/clients/${id}`, { method: 'DELETE' }),
};

// Destinations
export const destinationAPI = {
  getAll: () => request('/api/destinations'),
  add: (name) => request('/api/destinations', { method: 'POST', body: JSON.stringify({ name }) }),
  delete: (name) => request(`/api/destinations/${encodeURIComponent(name)}`, { method: 'DELETE' }),
};
