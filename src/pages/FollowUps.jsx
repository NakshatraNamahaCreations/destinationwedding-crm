import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatDate, formatBudgetRange, getStatusColor } from '../utils/helpers';
import { Search, Clock, Eye, X, ArrowLeft } from 'lucide-react';


export default function FollowUps() {
  const navigate = useNavigate();
  const { enquiries, updateEnquiryStatus, addFollowUp, convertToClient, PIPELINE_STAGES, CONTACT_METHODS } = useCRM();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showNewFollowUp, setShowNewFollowUp] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newFollowUpForm, setNewFollowUpForm] = useState({ date: '', method: 'Call', notes: '', nextAction: '' });

  // Show one row per enquiry (latest follow-up), so each enquiry has its own status
  const allFollowUps = useMemo(() => {
    let entries = enquiries
      .filter(e => e.followUps.length > 0 && e.status !== 'Converted')
      .map(e => {
        // Get the latest follow-up for this enquiry
        const latestFollowUp = [...e.followUps].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return {
          ...latestFollowUp,
          totalFollowUps: e.followUps.length,
          enquiryId: e.id,
          coupleName: e.coupleName,
          phone: e.phone,
          email: e.email,
          destination: e.destination,
          estimatedBudget: e.estimatedBudget,
          weddingDate: e.weddingDate,
          leadSource: e.leadSource,
          enquiryStatus: e.status,
          nextFollowUp: e.nextFollowUp,
          allFollowUps: e.followUps,
        };
      });

    if (search) {
      entries = entries.filter(f =>
        f.coupleName.toLowerCase().includes(search.toLowerCase()) ||
        f.notes.toLowerCase().includes(search.toLowerCase()) ||
        f.enquiryId.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (methodFilter) {
      entries = entries.filter(f => f.method === methodFilter);
    }

    if (sortBy === 'newest') entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    else entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    return entries;
  }, [enquiries, search, methodFilter, sortBy]);

  const totalFollowUps = allFollowUps.length;
  const activeCount = allFollowUps.filter(f => f.enquiryStatus !== 'Lost').length;
  const lostCount = allFollowUps.filter(f => f.enquiryStatus === 'Lost').length;
  const proposalCount = allFollowUps.filter(f => f.enquiryStatus === 'Proposal Sent' || f.enquiryStatus === 'Negotiation').length;

  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none min-w-[110px]";

  const methodBadge = (method) => {
    const colors = {
      Call: 'bg-blue-100 text-blue-700',
      Meeting: 'bg-purple-100 text-purple-700',
      WhatsApp: 'bg-green-100 text-green-700',
      Email: 'bg-gray-100 text-gray-700',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">FOLLOW-UPS</h1>
        <p className="text-xs text-gray-500 mt-0.5">Enquiries with scheduled follow-ups sorted by date</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Follow-ups', value: totalFollowUps, bg: 'bg-rose-100', color: 'text-[#8B1A1A]' },
          { label: 'Active', value: activeCount, bg: 'bg-green-100', color: 'text-green-600' },
          { label: 'Proposal/Negotiation', value: proposalCount, bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Lost', value: lostCount, bg: 'bg-red-100', color: 'text-red-600' },
        ].map(({ label, value, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
              <Clock className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Filters</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Contact Method</label>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className={selectClass}>
              <option value="">All</option>
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <button className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-900">Follow-up List</h2>
            <p className="text-[10px] text-gray-400">Showing {allFollowUps.length} follow-ups • Sorted by {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left pl-4 pr-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">SL</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Enquiry ID</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Client Details</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Destination</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Budget</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Method</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Last Follow-up</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px]">Last Notes</th>
                <th className="text-left px-2 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Status</th>
                <th className="text-left px-2 pr-4 py-2.5 font-semibold text-gray-500 uppercase text-[9px] whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allFollowUps.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-[11px]">No follow-ups recorded yet. Log a follow-up from the Enquiry page.</td></tr>
              ) : (
                allFollowUps.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="pl-4 pr-2 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-2 py-3 text-gray-500 font-mono text-[10px] whitespace-nowrap">{f.enquiryId}</td>
                    <td className="px-2 py-3">
                      <p className="font-medium text-gray-900 whitespace-nowrap">{f.coupleName}</p>
                      <p className="text-[9px] text-gray-400">{f.phone}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{f.destination}</td>
                    <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap">{formatBudgetRange(f.estimatedBudget)}</td>
                    <td className="px-2 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${methodBadge(f.method)}`}>{f.method}</span>
                      {f.totalFollowUps > 1 && <span className="text-[8px] text-gray-400 ml-1">({f.totalFollowUps})</span>}
                    </td>
                    <td className="px-2 py-3 text-gray-500 whitespace-nowrap">{formatDate(f.date)}</td>
                    <td className="px-2 py-3 text-gray-700 max-w-[200px]"><p className="truncate">{f.notes}</p></td>
                    <td className="px-2 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(f.enquiryStatus)}`}>{f.enquiryStatus}</span>
                    </td>
                    <td className="px-2 pr-4 py-3">
                      <button onClick={() => setSelectedEnquiry(f)} className="flex items-center gap-1 text-[10px] text-[#8B1A1A] font-medium whitespace-nowrap hover:underline">
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && !showUpdateStatus && !showNewFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedEnquiry(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[480px] max-w-[90vw]">
            {/* Header with avatar */}
            <div className="bg-[#2d2d3d] rounded-t-xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8B1A1A] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{selectedEnquiry.coupleName.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-[14px] text-white">{selectedEnquiry.coupleName}</h2>
                  <p className="text-[10px] text-gray-400">{selectedEnquiry.enquiryId} • {selectedEnquiry.destination}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Quick Info Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Budget</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{formatBudgetRange(selectedEnquiry.estimatedBudget)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Wedding</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{formatDate(selectedEnquiry.weddingDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Status</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(selectedEnquiry.enquiryStatus)}`}>{selectedEnquiry.enquiryStatus}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 uppercase font-semibold mb-2">Contact</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-gray-400">Phone: </span><span className="font-medium text-gray-900">{selectedEnquiry.phone}</span></div>
                  <div><span className="text-gray-400">Email: </span><span className="font-medium text-gray-900">{selectedEnquiry.email || 'N/A'}</span></div>
                  <div><span className="text-gray-400">Source: </span><span className="font-medium text-gray-900">{selectedEnquiry.leadSource}</span></div>
                </div>
              </div>

              {/* All Follow-up History */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-semibold mb-2">Follow-up History ({selectedEnquiry.allFollowUps.length})</p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {[...selectedEnquiry.allFollowUps].sort((a, b) => new Date(b.date) - new Date(a.date)).map((f, i) => (
                    <div key={f.id} className={`rounded-lg p-3 text-[11px] ${i === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{formatDate(f.date)}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${methodBadge(f.method)}`}>{f.method}</span>
                          {i === 0 && <span className="text-[8px] px-1.5 py-0.5 bg-blue-200 text-blue-700 rounded font-semibold">Latest</span>}
                        </div>
                      </div>
                      <p className="text-gray-700">{f.notes}</p>
                      {f.nextAction && <p className="text-gray-400 mt-1 text-[10px]">Next: {f.nextAction}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button onClick={() => setSelectedEnquiry(null)} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">Close</button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUpdateStatus(true)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowNewFollowUp(true)}
                  className="px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors"
                >
                  New Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedEnquiry && showUpdateStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowUpdateStatus(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-[15px] text-gray-900">Update Status</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{selectedEnquiry.coupleName} • {selectedEnquiry.enquiryId}</p>
              </div>
              <button onClick={() => setShowUpdateStatus(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Current Status</p>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${getStatusColor(selectedEnquiry.enquiryStatus)}`}>{selectedEnquiry.enquiryStatus}</span>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                >
                  <option value="">Select Status</option>
                  {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowUpdateStatus(false)} className="px-4 py-2 text-xs font-medium text-gray-500">Cancel</button>
              <button
                onClick={() => {
                  if (newStatus) {
                    if (newStatus === 'Converted') {
                      convertToClient(selectedEnquiry.enquiryId);
                    } else {
                      updateEnquiryStatus(selectedEnquiry.enquiryId, newStatus);
                    }
                    setShowUpdateStatus(false);
                    setSelectedEnquiry(null);
                    setNewStatus('');
                  }
                }}
                className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Another Follow-up Modal */}
      {selectedEnquiry && showNewFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNewFollowUp(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-[15px] text-gray-900">Schedule Another Follow-up</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{selectedEnquiry.coupleName} • {selectedEnquiry.enquiryId}</p>
              </div>
              <button onClick={() => setShowNewFollowUp(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Follow-Up Date<span className="text-red-500">*</span></label>
                  <input type="date" value={newFollowUpForm.date} onChange={(e) => setNewFollowUpForm(p => ({...p, date: e.target.value}))} required className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Contact Method<span className="text-red-500">*</span></label>
                  <select value={newFollowUpForm.method} onChange={(e) => setNewFollowUpForm(p => ({...p, method: e.target.value}))} className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none">
                    {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Notes<span className="text-red-500">*</span></label>
                <textarea value={newFollowUpForm.notes} onChange={(e) => setNewFollowUpForm(p => ({...p, notes: e.target.value}))} rows={3} placeholder="What was discussed?" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Next Action</label>
                <input type="text" value={newFollowUpForm.nextAction} onChange={(e) => setNewFollowUpForm(p => ({...p, nextAction: e.target.value}))} placeholder="e.g. Send proposal by Friday" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowNewFollowUp(false)} className="px-4 py-2 text-xs font-medium text-gray-500">Cancel</button>
              <button
                onClick={() => {
                  if (newFollowUpForm.date && newFollowUpForm.notes) {
                    addFollowUp(selectedEnquiry.enquiryId, newFollowUpForm);
                    setShowNewFollowUp(false);
                    setSelectedEnquiry(null);
                    setNewFollowUpForm({ date: '', method: 'Call', notes: '', nextAction: '' });
                  }
                }}
                className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717]"
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
