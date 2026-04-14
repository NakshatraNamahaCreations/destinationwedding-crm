import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate, formatDateTime, getStatusColor, formatBudgetRange } from '../utils/helpers';
import { Search, Plus, Eye, Phone, X, User, CalendarDays, ChevronDown, ArrowLeft, Trash2, Pencil } from 'lucide-react';

/* ───────────────────────── Add Enquiry Modal ───────────────────────── */
function AddEnquiryModal({ open, onClose }) {
  const { addEnquiry, LEAD_SOURCES, DESTINATIONS } = useCRM();
  const [form, setForm] = useState({
    coupleName: '', phone: '', altPhone: '', email: '', leadSource: '',
    weddingDateFrom: '', weddingDateTo: '', numberOfDays: '', foodDays: '',
    destination: '', estimatedBudget: '', guestCount: '', message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate days when dates change
      if (name === 'weddingDateFrom' || name === 'weddingDateTo') {
        const from = new Date(name === 'weddingDateFrom' ? value : prev.weddingDateFrom);
        const to = new Date(name === 'weddingDateTo' ? value : prev.weddingDateTo);
        if (from && to && !isNaN(from) && !isNaN(to)) {
          const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
          updated.numberOfDays = diff > 0 ? String(diff) : '1';
          if (!updated.foodDays) updated.foodDays = updated.numberOfDays;
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    addEnquiry({
      ...form,
      weddingDate: form.weddingDateFrom,
      weddingDateTo: form.weddingDateTo,
      estimatedBudget: Number(form.estimatedBudget),
      guestCount: form.guestCount ? Number(form.guestCount) : null,
      notes: form.message, nextFollowUp: '',
    });
    setForm({ coupleName: '', phone: '', altPhone: '', email: '', leadSource: '', weddingDateFrom: '', weddingDateTo: '', numberOfDays: '', foodDays: '', destination: '', estimatedBudget: '', guestCount: '', message: '' });
    onClose();
  };

  if (!open) return null;
  const inp = "w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";
  const lbl = "block text-[11px] font-medium text-gray-500 mb-1.5";

  const showDaysFields = form.weddingDateFrom && form.weddingDateTo && Number(form.numberOfDays) > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[600px] max-w-[92vw] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-[15px] text-gray-900">Add Enquiry</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {/* Row 1: Name + Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Couple Name/Person Name<span className="text-red-500">*</span></label><input type="text" name="coupleName" value={form.coupleName} onChange={handleChange} placeholder="e.g. Priyal & Abhishek" required className={inp} /></div>
            <div><label className={lbl}>Mobile Number<span className="text-red-500">*</span></label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +91 xxxxxxxx" required className={inp} /></div>
          </div>
          {/* Row 2: Alt Mobile + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Alternate Mobile Number<span className="text-red-500">*</span></label><input type="tel" name="altPhone" value={form.altPhone} onChange={handleChange} placeholder="e.g. +91 xxxxxxxx" required className={inp} /></div>
            <div><label className={lbl}>Email ID</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. yourname@gmail.com" className={inp} /></div>
          </div>
          {/* Row 3: Enquiry Type + Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Enquiry Type<span className="text-red-500">*</span></label><select name="leadSource" value={form.leadSource} onChange={handleChange} required className={inp}><option value="">Select</option>{LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className={lbl}>Destination<span className="text-red-500">*</span></label><select name="destination" value={form.destination} onChange={handleChange} required className={inp}><option value="">Select</option>{DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          {/* Row 4: Wedding Date From + To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Wedding Date (From)<span className="text-red-500">*</span></label>
              <input type="date" name="weddingDateFrom" value={form.weddingDateFrom} onChange={handleChange} required className={inp} />
            </div>
            <div>
              <label className={lbl}>Wedding Date (To)<span className="text-red-500">*</span></label>
              <input type="date" name="weddingDateTo" value={form.weddingDateTo} onChange={handleChange} min={form.weddingDateFrom} required className={inp} />
            </div>
          </div>
          {/* Row 5: Days + Food Days (shown only if multi-day) */}
          {showDaysFields && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Number of Days</label><input type="number" name="numberOfDays" value={form.numberOfDays} onChange={handleChange} className={inp} readOnly /></div>
              <div><label className={lbl}>Food for How Many Days<span className="text-red-500">*</span></label><input type="number" name="foodDays" value={form.foodDays} onChange={handleChange} placeholder="e.g. 3" min="1" required className={inp} /></div>
            </div>
          )}
          {/* Row 6: Budget + Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Estimated Budget<span className="text-red-500">*</span></label>
              <select name="estimatedBudget" value={form.estimatedBudget} onChange={handleChange} required className={inp}>
                <option value="">Select Budget Range</option>
                <option value="1000000">Below 10 Lakhs</option>
                <option value="1500000">10 - 15 Lakhs</option>
                <option value="2500000">15 - 25 Lakhs</option>
                <option value="3500000">25 - 35 Lakhs</option>
                <option value="5000000">35 - 50 Lakhs</option>
                <option value="5000001">Above 50 Lakhs</option>
              </select>
            </div>
            <div><label className={lbl}>No of Guests<span className="text-red-500">*</span></label><input type="number" name="guestCount" value={form.guestCount} onChange={handleChange} placeholder="No of Guests" required className={inp} /></div>
          </div>
          {/* Row 7: Message */}
          <div>
            <label className={lbl}>Message / Special Requirements</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Any special requirements, preferences, or notes..." className={inp} />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Enquiry</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Enquiry Details Modal ───────────────────── */
function EnquiryDetailModal({ enquiry, onClose, onFollowUp }) {
  if (!enquiry) return null;

  const infoBox = "border border-gray-200 rounded-lg p-4";
  const sectionTitle = "flex items-center gap-2 text-[12px] font-semibold text-gray-700 mb-3";
  const row = "flex items-center justify-between py-1";
  const labelCls = "text-[11px] text-gray-400";
  const valueCls = "text-[11px] font-medium text-gray-900 text-right";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[600px] max-w-[92vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-[15px] text-gray-900">Enquiry Details</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Complete Details about the enquiry</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - 2x2 grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {/* Client Information */}
          <div className={infoBox}>
            <div className={sectionTitle}>
              <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center"><User className="w-3 h-3 text-blue-600" /></div>
              Client Information
            </div>
            <div className="space-y-1.5">
              <div className={row}><span className={labelCls}>Name</span><span className={valueCls}>{enquiry.coupleName}</span></div>
              <div className={row}><span className={labelCls}>ID</span><span className={valueCls}>{enquiry.id}</span></div>
            </div>
          </div>

          {/* Contact Information */}
          <div className={infoBox}>
            <div className={sectionTitle}>
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center"><Phone className="w-3 h-3 text-green-600" /></div>
              Contact Information
            </div>
            <div className="space-y-1.5">
              <div className={row}><span className={labelCls}>Mobile Number</span><span className={valueCls}>{enquiry.phone}</span></div>
              <div className={row}><span className={labelCls}>Email ID</span><span className={valueCls}>{enquiry.email || 'N/A'}</span></div>
            </div>
          </div>

          {/* Status Information */}
          <div className={infoBox}>
            <div className={sectionTitle}>
              <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center"><span className="text-[10px]">🔶</span></div>
              Status Information
            </div>
            <div className="space-y-1.5">
              <div className={row}>
                <span className={labelCls}>Current Status</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(enquiry.status)}`}>{enquiry.status}</span>
              </div>
              <div className={row}><span className={labelCls}>Last Updated By</span><span className={valueCls}>N/A</span></div>
            </div>
          </div>

          {/* Timestamps */}
          <div className={infoBox}>
            <div className={sectionTitle}>
              <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center"><CalendarDays className="w-3 h-3 text-purple-600" /></div>
              Timestamps
            </div>
            <div className="space-y-1.5">
              <div className={row}><span className={labelCls}>Created At</span><span className={valueCls}>{formatDateTime(enquiry.createdAt)}</span></div>
              <div className={row}><span className={labelCls}>Last Updated</span><span className={valueCls}>{enquiry.activities.length > 0 ? formatDateTime(enquiry.activities[enquiry.activities.length - 1].timestamp) : 'N/A'}</span></div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Close</button>
          {enquiry.status !== 'Converted' && enquiry.status !== 'Lost' && (
            <button onClick={() => { onClose(); onFollowUp(enquiry); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Log Follow-Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Log Follow-Up Modal ───────────────────── */
function FollowUpModal({ enquiry, onClose }) {
  const { addFollowUp, CONTACT_METHODS } = useCRM();
  const [form, setForm] = useState({ date: '', method: 'Call', notes: '', nextAction: '' });

  if (!enquiry) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    addFollowUp(enquiry.id, form);
    setForm({ date: '', method: 'Call', notes: '', nextAction: '' });
    onClose();
  };

  const inp = "w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";
  const lbl = "block text-[11px] font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[15px] text-gray-900">Log New Follow-Up</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Follow-Up Date<span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} required className={inp} />
            </div>
            <div>
              <label className={lbl}>Contact Method<span className="text-red-500">*</span></label>
              <select value={form.method} onChange={(e) => setForm(p => ({ ...p, method: e.target.value }))} className={inp}>
                {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Follow-Up Notes<span className="text-red-500">*</span></label>
            <textarea value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} required rows={3} placeholder="What was discussed? Any decisions made? Client feedback?" className={inp} />
          </div>
          <div>
            <label className={lbl}>Next Action/Reminder</label>
            <input type="text" value={form.nextAction} onChange={(e) => setForm(p => ({ ...p, nextAction: e.target.value }))} placeholder="e.g. Send proposal by Friday" className={inp} />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Client</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Edit Enquiry Modal ───────────────────── */
function EditEnquiryModal({ enquiry, onClose }) {
  const { updateEnquiry, LEAD_SOURCES, DESTINATIONS } = useCRM();
  const [form, setForm] = useState({
    coupleName: enquiry?.coupleName || '', phone: enquiry?.phone || '', altPhone: enquiry?.altPhone || '',
    email: enquiry?.email || '', leadSource: enquiry?.leadSource || '', destination: enquiry?.destination || '',
    weddingDate: enquiry?.weddingDate || '', estimatedBudget: enquiry?.estimatedBudget || '',
    guestCount: enquiry?.guestCount || '', notes: enquiry?.notes || '',
  });

  if (!enquiry) return null;

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleSave = () => {
    updateEnquiry(enquiry.id, { ...form, estimatedBudget: Number(form.estimatedBudget), guestCount: form.guestCount ? Number(form.guestCount) : null });
    onClose();
  };

  const inp = "w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";
  const lbl = "block text-[11px] font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-[15px] text-gray-900">Edit Enquiry</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Couple Name<span className="text-red-500">*</span></label><input type="text" name="coupleName" value={form.coupleName} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Mobile Number<span className="text-red-500">*</span></label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Alternate Mobile</label><input type="tel" name="altPhone" value={form.altPhone} onChange={handleChange} className={inp} /></div>
            <div><label className={lbl}>Email ID</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Enquiry Type</label><select name="leadSource" value={form.leadSource} onChange={handleChange} className={inp}><option value="">Select</option>{LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className={lbl}>Destination</label><select name="destination" value={form.destination} onChange={handleChange} className={inp}><option value="">Select</option>{DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Wedding Date</label><input type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange} className={inp} /></div>
            <div>
              <label className={lbl}>Estimated Budget</label>
              <select name="estimatedBudget" value={form.estimatedBudget} onChange={handleChange} className={inp}>
                <option value="">Select</option>
                <option value="1000000">Below 10 Lakhs</option>
                <option value="1500000">10 - 15 Lakhs</option>
                <option value="2500000">15 - 25 Lakhs</option>
                <option value="3500000">25 - 35 Lakhs</option>
                <option value="5000000">35 - 50 Lakhs</option>
                <option value="5000001">Above 50 Lakhs</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>No of Guests</label><input type="number" name="guestCount" value={form.guestCount || ''} onChange={handleChange} className={inp} /></div>
          </div>
          <div>
            <label className={lbl}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className={inp} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Enquiry List Page ───────────────────────── */
export default function EnquiryList() {
  const navigate = useNavigate();
  const { enquiries, PIPELINE_STAGES, LEAD_SOURCES, DESTINATIONS, convertToClient, deleteEnquiry } = useCRM();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailEnquiry, setDetailEnquiry] = useState(null);
  const [followUpEnquiry, setFollowUpEnquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Only show enquiries that have NO follow-ups logged (once follow-up is added, it moves to Follow-ups page)
  const filtered = useMemo(() => {
    let result = enquiries.filter(e => {
      const hasFollowUps = e.followUps.length > 0;
      if (hasFollowUps) return false; // Move to Follow-ups page
      const matchSearch = !search || e.coupleName.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search) || e.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || e.status === statusFilter;
      const matchSource = !sourceFilter || e.leadSource === sourceFilter;
      const matchDest = !destFilter || e.destination === destFilter;
      return matchSearch && matchStatus && matchSource && matchDest;
    });
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(e => e.createdAt.startsWith(today));
    }
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'budget_high') result.sort((a, b) => b.estimatedBudget - a.estimatedBudget);
    else if (sortBy === 'budget_low') result.sort((a, b) => a.estimatedBudget - b.estimatedBudget);
    return result;
  }, [enquiries, search, statusFilter, sourceFilter, destFilter, dateFilter, sortBy]);

  const handleConvert = (e) => {
    if (window.confirm(`Convert "${e.coupleName}" to a client?`)) {
      convertToClient(e.id);
    }
  };

  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none min-w-[120px]";

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ENQUIRIES</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all incoming enquiries from calls and meetings</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Enquiry
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Filters</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] text-gray-500 mb-1">Search enquiries</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search by name or number..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="">All Status</option>
              {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
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
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
            </select>
          </div>
        </div>
        <div className="flex items-end gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Source</label>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectClass}>
              <option value="">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Destination</label>
            <select value={destFilter} onChange={(e) => setDestFilter(e.target.value)} className={selectClass}>
              <option value="">All Destinations</option>
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); setDestFilter(''); setDateFilter(''); setSortBy('newest'); }}
            className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 font-medium">Clear</button>
          <button className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">Apply</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-900">Enquiry List</h2>
            <p className="text-[10px] text-gray-400">
              Showing 1 to {filtered.length} of {enquiries.length} • Sorted by {sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : sortBy === 'budget_high' ? 'Budget High' : 'Budget Low'} • Date: {dateFilter || 'all'}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Client Details</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Source</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Est Budget</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Destination</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No enquiries found</td></tr>
              ) : (
                filtered.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{e.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{e.coupleName}</p>
                      <p className="text-[10px] text-gray-400">{e.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.leadSource}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatBudgetRange(e.estimatedBudget)}</td>
                    <td className="px-4 py-3 text-gray-600">{e.destination}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(e.status)}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDetailEnquiry(e)} className="flex items-center gap-1 text-[11px] text-[#8B1A1A] hover:underline font-medium px-2 py-1 rounded hover:bg-rose-50">
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button onClick={() => setEditTarget(e)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {e.status !== 'Converted' && e.status !== 'Lost' && (
                          <>
                            <button onClick={() => setFollowUpEnquiry(e)} className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium px-2 py-1 rounded hover:bg-blue-50">
                              Follow up <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                            <button onClick={() => handleConvert(e)} className="flex items-center gap-1 text-[11px] text-green-600 hover:underline font-medium px-2 py-1 rounded hover:bg-green-50">
                              Convert <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setDeleteTarget(e)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600">
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
      </div>

      {/* Modals & Drawers */}
      <AddEnquiryModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EnquiryDetailModal enquiry={detailEnquiry} onClose={() => setDetailEnquiry(null)} onFollowUp={(e) => setFollowUpEnquiry(e)} />
      {followUpEnquiry && <FollowUpModal enquiry={followUpEnquiry} onClose={() => setFollowUpEnquiry(null)} />}
      {editTarget && <EditEnquiryModal enquiry={editTarget} onClose={() => setEditTarget(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-[15px] text-gray-900">Delete Enquiry</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget.coupleName}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                No, Cancel
              </button>
              <button
                onClick={() => { deleteEnquiry(deleteTarget.id); setDeleteTarget(null); }}
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
