import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { UserPlus } from 'lucide-react';

export default function EnquiryForm() {
  const { addEnquiry, LEAD_SOURCES, DESTINATIONS } = useCRM();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coupleName: '', phone: '', email: '', leadSource: '',
    weddingDate: '', destination: '', estimatedBudget: '',
    guestCount: '', notes: '', nextFollowUp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEnquiry({
      ...form,
      estimatedBudget: Number(form.estimatedBudget),
      guestCount: form.guestCount ? Number(form.guestCount) : null,
    });
    navigate('/enquiries');
  };

  const inputClass = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none transition-colors";
  const labelClass = "block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#8B1A1A] rounded-lg flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">ADD ENQUIRY</h1>
          <p className="text-xs text-gray-500">Capture details of a new wedding enquiry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {/* Couple Info */}
        <div className="p-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">Couple Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Couple Name *</label>
              <input type="text" name="coupleName" value={form.coupleName} onChange={handleChange} placeholder="e.g. Rahul & Priya" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="couple@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Lead Source *</label>
              <select name="leadSource" value={form.leadSource} onChange={handleChange} required className={inputClass}>
                <option value="">Select source</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Wedding Details */}
        <div className="p-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">Wedding Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Wedding Date *</label>
              <input type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Destination *</label>
              <select name="destination" value={form.destination} onChange={handleChange} required className={inputClass}>
                <option value="">Select destination</option>
                {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estimated Budget (₹) *</label>
              <input type="number" name="estimatedBudget" value={form.estimatedBudget} onChange={handleChange} placeholder="e.g. 2500000" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Guest Count</label>
              <input type="number" name="guestCount" value={form.guestCount} onChange={handleChange} placeholder="e.g. 200" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="p-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">Additional Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any special requirements..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Next Follow-up Date</label>
              <input type="date" name="nextFollowUp" value={form.nextFollowUp} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717] transition-colors">
            Create Enquiry
          </button>
          <button type="button" onClick={() => navigate('/enquiries')} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
