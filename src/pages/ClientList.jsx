import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { Eye, Search, Plus, X, Pencil, Trash2, ArrowLeft } from 'lucide-react';

const PAGE_SIZE = 10;

/* ────────────────── Add Client Modal ────────────────── */
function AddClientModal({ open, onClose }) {
  const { DESTINATIONS } = useCRM();
  const [form, setForm] = useState({
    coupleName: '', phone: '', email: '', venue: '', theme: '', destination: '',
    weddingDate: '', package: '', guestCount: '', budget: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  const inp = "w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";
  const lbl = "block text-[11px] font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[15px] text-gray-900">Add Client</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Couple Name</label><input type="text" name="coupleName" value={form.coupleName} onChange={handleChange} placeholder="Enter Couple Name" className={inp} /></div>
            <div><label className={lbl}>Mobile Number</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter Mobile Number" className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Email ID</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter Email Id" className={inp} /></div>
            <div><label className={lbl}>Venue</label><select name="venue" value={form.venue} onChange={handleChange} className={inp}><option value="">Select Venue</option><option value="Sunset Villa">Sunset Villa</option><option value="Hill View Resort">Hill View Resort</option><option value="Leela Palace">Leela Palace</option><option value="Lawn & Villa">Lawn & Villa</option><option value="Taj Palace">Taj Palace</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Theme</label><select name="theme" value={form.theme} onChange={handleChange} className={inp}><option value="">Select Theme</option><option value="Royal">Royal</option><option value="Signature">Signature</option><option value="Imperial">Imperial</option><option value="Beach">Beach</option><option value="Rustic">Rustic</option><option value="Modern">Modern</option></select></div>
            <div><label className={lbl}>Destination</label><select name="destination" value={form.destination} onChange={handleChange} className={inp}><option value="">Select Destination</option>{DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Date & Time</label><input type="datetime-local" name="weddingDate" value={form.weddingDate} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Package</label><select name="package" value={form.package} onChange={handleChange} className={inp}><option value="">Select Package</option><option value="Royal">Royal</option><option value="Signature">Signature</option><option value="Imperial">Imperial</option></select></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={onClose} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Client</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Client List Page ────────────────── */
/* ────────────────── Edit Client Modal ────────────────── */
function EditClientModal({ client, onClose }) {
  const { updateClient, DESTINATIONS } = useCRM();
  const [form, setForm] = useState({
    coupleName: client?.coupleName || '', phone: client?.phone || '', email: client?.email || '',
    destination: client?.destination || '', guestCount: client?.guestCount || '', budget: client?.budget || '',
  });

  if (!client) return null;

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleSave = () => {
    updateClient(client.id, { ...form, guestCount: Number(form.guestCount), budget: Number(form.budget) });
    onClose();
  };

  const inp = "w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";
  const lbl = "block text-[11px] font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[15px] text-gray-900">Edit Client</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Couple Name</label><input type="text" name="coupleName" value={form.coupleName} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Phone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Destination</label>
              <select name="destination" value={form.destination} onChange={handleChange} className={inp}>
                <option value="">Select</option>{DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>No. of Guests</label><input type="number" name="guestCount" value={form.guestCount} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Budget (₹)</label><input type="number" name="budget" value={form.budget} onChange={handleChange} className={inp} /></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Client List Page ────────────────── */
export default function ClientList() {
  const { clients, deleteClient } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const filtered = useMemo(() => {
    let result = clients.filter(c => {
      const matchSearch = !search || c.coupleName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.convertedAt) - new Date(a.convertedAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.convertedAt) - new Date(b.convertedAt));
    return result;
  }, [clients, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none min-w-[120px]";

  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CLIENTS</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all confirmed wedding bookings</p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Filters</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] text-gray-500 mb-1">Search clients</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or number..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Date</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={selectClass}>
              <option value="">All Dates</option>
              <option value="today">Today</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <div>
          <button className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-900">Clients List</h2>
            <p className="text-[10px] text-gray-400">
              Showing {filtered.length > 0 ? ((page - 1) * PAGE_SIZE) + 1 : 0} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} • Sorted by Newest First • Date: all
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Client Details</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Destination</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Budget</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Guests</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Source</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">No clients found</td>
                </tr>
              ) : (
                paginated.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.coupleName}</p>
                      <p className="text-[10px] text-gray-400">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.destination}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(c.budget)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.weddingDate)}</td>
                    <td className="px-4 py-3 text-gray-700 text-center">{c.guestCount}</td>
                    <td className="px-4 py-3 text-gray-500">{c.leadSource || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-green-100 text-green-700">Active</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/clients/${c.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => setEditTarget(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">Page {page} to {totalPages} • {filtered.length} total pages</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-gray-500"
              >
                &lt; Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-[11px] rounded-lg font-medium ${p === page ? 'bg-[#8B1A1A] text-white' : 'text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-gray-500"
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Drawer */}
      <AddClientModal open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {editTarget && <EditClientModal client={editTarget} onClose={() => setEditTarget(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-[15px] text-gray-900">Delete Client</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget.coupleName}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                No, Cancel
              </button>
              <button
                onClick={() => { deleteClient(deleteTarget.id); setDeleteTarget(null); }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
