import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatBudgetRange, formatDate, formatDateTime, getStatusColor } from '../utils/helpers';
import {
  ArrowLeft, Phone, MessageCircle, Mail, MapPin, Calendar, Users as UsersIcon,
  IndianRupee, Clock, Plus, UserCheck, ChevronDown, FileText, X
} from 'lucide-react';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enquiries, updateEnquiryStatus, addFollowUp, addNote, convertToClient, PIPELINE_STAGES, CONTACT_METHODS } = useCRM();
  const enquiry = enquiries.find(e => e.id === id);

  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({ date: '', method: 'Call', notes: '', nextAction: '', nextFollowUpDate: '' });
  const [noteText, setNoteText] = useState('');

  if (!enquiry) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Enquiry not found</p>
        <Link to="/enquiries" className="text-[#8B1A1A] text-sm mt-2 inline-block">Back to enquiries</Link>
      </div>
    );
  }

  const handleConvert = () => {
    if (window.confirm(`Convert "${enquiry.coupleName}" to a client?`)) {
      convertToClient(enquiry.id);
      navigate('/clients');
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";

  const activityIcons = {
    created: '🆕', call: '📞', meeting: '🤝', whatsapp: '💬',
    email: '📧', status_change: '🔄', note: '📝', converted: '✅',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-200 bg-white border border-gray-200">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{enquiry.coupleName}</h1>
            <p className="text-[11px] text-gray-500">{enquiry.id} • Created {formatDate(enquiry.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {enquiry.status !== 'Converted' && enquiry.status !== 'Lost' && (
            <button onClick={handleConvert} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              <UserCheck className="w-3.5 h-3.5" /> Convert to Client
            </button>
          )}
          <div className="relative">
            <button onClick={() => setShowStatusMenu(!showStatusMenu)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${getStatusColor(enquiry.status)}`}>
              {enquiry.status} <ChevronDown className="w-3 h-3" />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-44">
                {PIPELINE_STAGES.map(s => (
                  <button key={s} onClick={() => { updateEnquiryStatus(enquiry.id, s); setShowStatusMenu(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${s === enquiry.status ? 'font-bold text-[#8B1A1A]' : 'text-gray-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-sm text-gray-900 mb-4">Enquiry Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'Phone', value: enquiry.phone || '-', href: enquiry.phone ? `tel:${enquiry.phone}` : null },
                { icon: Phone, label: 'Alt Mobile', value: enquiry.altPhone || '-' },
                { icon: Mail, label: 'Email', value: enquiry.email || '-', href: enquiry.email ? `mailto:${enquiry.email}` : null },
                { icon: MapPin, label: 'Destination', value: enquiry.destination || '-' },
                { icon: Calendar, label: 'Wedding Date (From)', value: formatDate(enquiry.weddingDate) },
                { icon: Calendar, label: 'Wedding Date (To)', value: enquiry.weddingDateTo ? formatDate(enquiry.weddingDateTo) : 'Same day' },
                { icon: Calendar, label: 'Number of Days', value: enquiry.numberOfDays ? `${enquiry.numberOfDays} Day${Number(enquiry.numberOfDays) > 1 ? 's' : ''}` : '1 Day' },
                { icon: Calendar, label: 'Food Days', value: enquiry.foodDays || '-' },
                { icon: IndianRupee, label: 'Budget', value: formatBudgetRange(enquiry.estimatedBudget) },
                { icon: UsersIcon, label: 'Guests', value: enquiry.guestCount || '-' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">{label}</p>
                    {href ? (
                      <a href={href} className="text-xs font-medium text-gray-900 hover:text-[#8B1A1A]">{value}</a>
                    ) : (
                      <p className="text-xs font-medium text-gray-900">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {enquiry.notes && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase mb-1">Notes</p>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{enquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Follow-ups */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-sm text-gray-900">Follow-ups ({enquiry.followUps.length})</h2>
              <button onClick={() => setShowFollowUpForm(!showFollowUpForm)} className="flex items-center gap-1 text-xs text-[#8B1A1A] hover:underline font-medium">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {enquiry.followUps.length === 0 ? (
                <p className="p-5 text-xs text-gray-400">No follow-ups yet</p>
              ) : (
                [...enquiry.followUps].reverse().map(f => (
                  <div key={f.id} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${f.method === 'Call' ? 'bg-blue-100 text-blue-700' : f.method === 'Meeting' ? 'bg-purple-100 text-purple-700' : f.method === 'WhatsApp' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {f.method}
                      </span>
                      <span className="text-[10px] text-gray-400">{formatDate(f.date)}</span>
                    </div>
                    <p className="text-xs text-gray-700">{f.notes}</p>
                    {f.nextAction && <p className="text-[10px] text-gray-400 mt-1">Next: {f.nextAction}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { href: `tel:${enquiry.phone}`, icon: Phone, label: 'Call', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
                { href: `https://wa.me/919035416661`, icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600', bg: 'hover:bg-green-50', external: true },
              ].map(({ href, icon: Icon, label, color, bg, external }) => (
                <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-lg ${bg} ${color} font-medium`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </a>
              ))}
              <button onClick={() => setShowFollowUpForm(true)} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-lg hover:bg-purple-50 text-purple-600 font-medium">
                <Clock className="w-3.5 h-3.5" /> Add Follow-up
              </button>
              <button onClick={() => setShowNoteForm(true)} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-lg hover:bg-amber-50 text-amber-600 font-medium">
                <FileText className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Info</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Lead Source', value: enquiry.leadSource },
                { label: 'Next Follow-up', value: formatDate(enquiry.nextFollowUp) },
                { label: 'Total Follow-ups', value: enquiry.followUps.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Activity Timeline</h3>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {[...enquiry.activities].reverse().map(a => (
                <div key={a.id} className="flex gap-2.5">
                  <span className="text-base shrink-0">{activityIcons[a.type] || '📋'}</span>
                  <div>
                    <p className="text-xs text-gray-700">{a.description}</p>
                    <p className="text-[10px] text-gray-400">{formatDateTime(a.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Modal */}
      {showFollowUpForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFollowUpForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[15px] text-gray-900">Add Follow-up</h2>
              <button onClick={() => setShowFollowUpForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addFollowUp(enquiry.id, followUpForm); setFollowUpForm({ date: '', method: 'Call', notes: '', nextAction: '', nextFollowUpDate: '' }); setShowFollowUpForm(false); }} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Date<span className="text-red-500">*</span></label>
                  <input type="date" value={followUpForm.date} onChange={(e) => setFollowUpForm(p => ({ ...p, date: e.target.value }))} required className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Method<span className="text-red-500">*</span></label>
                  <select value={followUpForm.method} onChange={(e) => setFollowUpForm(p => ({ ...p, method: e.target.value }))} className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none">
                    {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Notes<span className="text-red-500">*</span></label>
                <textarea value={followUpForm.notes} onChange={(e) => setFollowUpForm(p => ({ ...p, notes: e.target.value }))} required rows={3} placeholder="What was discussed?" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Next Action</label>
                  <input type="text" value={followUpForm.nextAction} onChange={(e) => setFollowUpForm(p => ({ ...p, nextAction: e.target.value }))} placeholder="e.g. Send proposal" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Next Follow-up Date</label>
                  <input type="date" value={followUpForm.nextFollowUpDate} onChange={(e) => setFollowUpForm(p => ({ ...p, nextFollowUpDate: e.target.value }))} className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowFollowUpForm(false)} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Follow-up</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNoteForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[480px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[15px] text-gray-900">Add Note</h2>
              <button onClick={() => setShowNoteForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addNote(enquiry.id, noteText); setNoteText(''); setShowNoteForm(false); }} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Note<span className="text-red-500">*</span></label>
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} required rows={4} placeholder="Add a note about this enquiry..." className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNoteForm(false)} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
