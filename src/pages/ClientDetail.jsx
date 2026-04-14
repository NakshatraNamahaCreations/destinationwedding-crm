import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate, daysUntil } from '../utils/helpers';
import { ArrowLeft, Calendar, MapPin, Plus, X } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addPayment, addEvent } = useCRM();
  const client = clients.find(c => c.id === id);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: '', method: 'Bank Transfer', note: '' });
  const [eventForm, setEventForm] = useState({ type: 'Wedding', date: '', venue: '', status: 'Pending' });

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Client not found</p>
        <Link to="/clients" className="text-[#8B1A1A] text-sm mt-2 inline-block">Back to clients</Link>
      </div>
    );
  }

  const days = daysUntil(client.weddingDate);
  const pending = client.budget - client.totalPaid;
  const progress = client.budget > 0 ? Math.round((client.totalPaid / client.budget) * 100) : 0;

  const getVenue = () => {
    const wedding = client.events.find(e => e.type === 'Wedding');
    return wedding ? (wedding.venue || client.destination) : (client.events.length > 0 ? client.events[0].venue : client.destination);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    addPayment(client.id, { ...paymentForm, amount: Number(paymentForm.amount) });
    setPaymentForm({ amount: '', date: '', method: 'Bank Transfer', note: '' });
    setShowPaymentForm(false);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    addEvent(client.id, eventForm);
    setEventForm({ type: 'Wedding', date: '', venue: '', status: 'Pending' });
    setShowEventForm(false);
  };

  const inp = "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none";

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/clients')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {/* Top row: avatar + name + days */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#8B1A1A] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">{client.coupleName.charAt(0)}{client.coupleName.split('&')[1]?.trim().charAt(0) || ''}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 italic">{client.coupleName}</h1>
              <p className="text-[11px] text-gray-400">Client ID: {client.id}</p>
            </div>
          </div>
          {days !== null && days >= 0 && (
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{days}</p>
              <p className="text-[10px] text-gray-400">Days until wedding</p>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDate(client.weddingDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {getVenue()}
          </span>
          <span className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium uppercase tracking-wide">
            {client.destination}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-0 mt-5 border-t border-gray-100 pt-4 divide-x divide-gray-100">
          {[
            { value: client.guestCount || 'N/A', label: 'Guests' },
            { value: client.budget ? formatCurrency(client.budget) : '₹0', label: 'Total Budget' },
            { value: (client.events || []).length, label: 'Events' },
            { value: (client.team || []).length, label: 'Vendors' },
            { value: client.numberOfDays ? `${client.numberOfDays} Day${Number(client.numberOfDays) > 1 ? 's' : ''}` : '1 Day', label: 'Duration' },
          ].map(({ value, label }) => (
            <div key={label} className="flex-1 text-center px-2">
              <p className="text-sm font-bold text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {['Overview', 'Events', 'Payments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-5 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === tab.toLowerCase()
                ? 'text-[#8B1A1A] border-b-2 border-[#8B1A1A]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Couple Information */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-[#8B1A1A]">Couple Information</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Couple Name', value: client.coupleName },
                { label: 'Mobile Number', value: client.phone },
                { label: 'Alternate Mobile', value: client.altPhone || 'N/A' },
                { label: 'Email ID', value: client.email || 'N/A' },
                { label: 'Lead Source', value: client.leadSource || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400">{label}</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wedding Information */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-[#8B1A1A]">Wedding Information</h3>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-gray-400">Destination</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{client.destination}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Budget</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{formatCurrency(client.budget)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">No. of Guests</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{client.guestCount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Wedding Date (From)</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />{formatDate(client.weddingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Wedding Date (To)</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{client.weddingDateTo ? formatDate(client.weddingDateTo) : 'Same day'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Number of Days</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{client.numberOfDays || '1'} Day{(client.numberOfDays || 1) > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Food Days</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{client.foodDays || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Booking Date</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{formatDate(client.convertedAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Booking Status</p>
                  <p className="text-xs font-medium text-green-600 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message / Special Requirements */}
          {client.message && (
            <div className="bg-white rounded-xl border border-gray-200 lg:col-span-2">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-[#8B1A1A]">Message / Special Requirements</h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{client.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Events Tab ─── */}
      {activeTab === 'events' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#8B1A1A]">Wedding Events</h3>
            <button onClick={() => setShowEventForm(true)} className="flex items-center gap-1.5 text-xs text-[#8B1A1A] font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add Event
            </button>
          </div>

          {client.events.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-xs text-gray-400">No events added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {client.events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(ev => {
                const cardColors = {
                  Haldi: 'bg-amber-50 border-amber-200',
                  Mehendi: 'bg-green-50 border-green-200',
                  Sangeet: 'bg-purple-50 border-purple-200',
                  Wedding: 'bg-rose-50 border-rose-200',
                  Reception: 'bg-blue-50 border-blue-200',
                };
                const subtitles = {
                  Haldi: 'Intimate Family Ceremony',
                  Mehendi: 'Intimate Family Ceremony',
                  Sangeet: 'Musical Night',
                  Wedding: 'Intimate Family Ceremony',
                  Reception: 'Dinner & celebrations',
                };
                const eventDate = new Date(ev.date);
                const dateStr = eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = eventDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

                return (
                  <div key={ev.id} className={`rounded-xl border p-4 ${cardColors[ev.type] || 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="text-sm font-bold text-gray-900">{ev.type === 'Reception' ? 'Grand Reception' : `${ev.type} Ceremony`}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{subtitles[ev.type] || 'Ceremony'}</p>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <MapPin className="w-3 h-3 text-[#8B1A1A]" />
                        {ev.venue || 'Venue TBD'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <Calendar className="w-3 h-3 text-[#8B1A1A]" />
                        {dateStr}{timeStr !== 'Invalid Date' ? `, ${timeStr}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Event Modal */}
          {showEventForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" onClick={() => setShowEventForm(false)} />
              <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[15px] text-gray-900">Add Event</h2>
                  <button onClick={() => setShowEventForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddEvent} className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Event Name</label>
                      <input type="text" value={eventForm.type} onChange={(e) => setEventForm(p => ({...p, type: e.target.value}))} placeholder="e.g. Sangeet" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Place</label>
                      <input type="text" value={eventForm.venue} onChange={(e) => setEventForm(p => ({...p, venue: e.target.value}))} placeholder="e.g. Poolside" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Date & Time</label>
                    <input type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm(p => ({...p, date: e.target.value}))} required className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Description</label>
                    <input type="text" placeholder="e.g. Intimate Family Ceremony" className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none" />
                  </div>
                </form>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowEventForm(false)} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                  <button onClick={handleAddEvent} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Add Event</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Payments Tab ─── */}
      {activeTab === 'payments' && (
        <div className="space-y-5">
          {/* Payment Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div />
              <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="flex items-center gap-1.5 text-xs text-[#8B1A1A] font-medium hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Payment
              </button>
            </div>

            {showPaymentForm && (
              <form onSubmit={handleAddPayment} className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] text-gray-500 mb-1">Amount (₹)*</label><input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm(p => ({...p, amount: e.target.value}))} required className={inp} /></div>
                  <div><label className="block text-[10px] text-gray-500 mb-1">Date*</label><input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm(p => ({...p, date: e.target.value}))} required className={inp} /></div>
                  <div><label className="block text-[10px] text-gray-500 mb-1">Method</label><select value={paymentForm.method} onChange={(e) => setPaymentForm(p => ({...p, method: e.target.value}))} className={inp}><option>UPI</option><option>Bank Transfer</option><option>Cheque</option><option>Cash</option></select></div>
                  <div><label className="block text-[10px] text-gray-500 mb-1">Service</label><input type="text" value={paymentForm.note} onChange={(e) => setPaymentForm(p => ({...p, note: e.target.value}))} placeholder="e.g. Flower Decoration" className={inp} /></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button type="submit" className="px-4 py-1.5 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium">Save</button>
                  <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-1.5 text-gray-500 text-xs">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Payment Mode</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Date</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Reference</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Service</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Amount</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {client.payments.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No payments recorded</td></tr>
                  ) : (
                    [...client.payments].reverse().map((p, idx) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{p.method}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{', '}{new Date(p.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono">UPI{String(Math.floor(Math.random() * 9000) + 1000)}</td>
                        <td className="px-4 py-3 text-gray-700">{p.note || 'General'}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
