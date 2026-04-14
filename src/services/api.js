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
  getAll: () => request('/enquiries'),
  getOne: (id) => request(`/enquiries/${id}`),
  create: (data) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addFollowUp: (id, followUp) => request(`/enquiries/${id}/follow-ups`, { method: 'POST', body: JSON.stringify(followUp) }),
  delete: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),
};

// Clients
export const clientAPI = {
  getAll: () => request('/clients'),
  getOne: (id) => request(`/clients/${id}`),
  convert: (enquiryId) => request(`/clients/convert/${enquiryId}`, { method: 'POST' }),
  update: (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addPayment: (id, payment) => request(`/clients/${id}/payments`, { method: 'POST', body: JSON.stringify(payment) }),
  addEvent: (id, event) => request(`/clients/${id}/events`, { method: 'POST', body: JSON.stringify(event) }),
  delete: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
};

// Destinations
export const destinationAPI = {
  getAll: () => request('/destinations'),
  add: (name) => request('/destinations', { method: 'POST', body: JSON.stringify({ name }) }),
  delete: (name) => request(`/destinations/${encodeURIComponent(name)}`, { method: 'DELETE' }),
};
