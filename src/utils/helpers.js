export function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
}

// Convert numeric budget value to the range label chosen during enquiry
export function formatBudgetRange(amount) {
  const n = Number(amount);
  if (!n) return '-';
  if (n === 1000000) return 'Below 10 Lakhs';
  if (n === 1500000) return '10 - 15 Lakhs';
  if (n === 2500000) return '15 - 25 Lakhs';
  if (n === 3500000) return '25 - 35 Lakhs';
  if (n === 5000000) return '35 - 50 Lakhs';
  if (n === 5000001) return 'Above 50 Lakhs';
  return formatCurrency(n);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export function isPast(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return d < t;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - t) / (1000 * 60 * 60 * 24));
}

export function getStatusColor(status) {
  const colors = {
    New: 'bg-blue-100 text-blue-700',
    Contacted: 'bg-yellow-100 text-yellow-700',
    'Meeting Scheduled': 'bg-purple-100 text-purple-700',
    'Proposal Sent': 'bg-indigo-100 text-indigo-700',
    Negotiation: 'bg-orange-100 text-orange-700',
    Converted: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
    Planning: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
