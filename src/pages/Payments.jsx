import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency } from '../utils/helpers';
import { Search, Download, Eye, FileText, Plus, Heart, Wallet, Clock, ArrowLeft, X } from 'lucide-react';

export default function Payments() {
  const navigate = useNavigate();
  const { clients, addPayment } = useCRM();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [billId, setBillId] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ clientId: '', amount: '', date: '', method: 'UPI', note: '' });
  const [invoicePayment, setInvoicePayment] = useState(null);

  const handleAddPayment = () => {
    if (!paymentForm.clientId || !paymentForm.amount || !paymentForm.date) return;
    addPayment(paymentForm.clientId, {
      amount: Number(paymentForm.amount),
      date: paymentForm.date,
      method: paymentForm.method,
      note: paymentForm.note,
    });
    setPaymentForm({ clientId: '', amount: '', date: '', method: 'UPI', note: '' });
    setShowAddPayment(false);
  };

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalCollected = clients.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalPending = clients.reduce((sum, c) => sum + (c.budget - c.totalPaid), 0);

  const allPayments = useMemo(() => {
    let payments = clients.flatMap(c =>
      c.payments.map((p, idx) => ({
        ...p,
        clientName: c.coupleName,
        clientId: c.id,
        clientPhone: c.phone,
        billRef: `DWC ${idx + 1}/${new Date(p.date).getMonth() + 1}/${String(new Date(p.date).getFullYear()).slice(2)}`,
      }))
    );

    // Filters
    if (search) {
      payments = payments.filter(p =>
        p.clientName.toLowerCase().includes(search.toLowerCase()) ||
        p.clientId.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (methodFilter) {
      payments = payments.filter(p => p.method === methodFilter);
    }

    // Sort
    if (sortBy === 'newest') payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'oldest') payments.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === 'amount_high') payments.sort((a, b) => b.amount - a.amount);
    else if (sortBy === 'amount_low') payments.sort((a, b) => a.amount - b.amount);

    return payments;
  }, [clients, search, methodFilter, sortBy]);

  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none min-w-[120px]";

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">PAYMENTS REPORT</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all payments in one place</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Filters</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] text-gray-500 mb-1">Search Payment</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Payment Method</label>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className={selectClass}>
              <option value="">All</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Bill ID</label>
            <input
              type="text"
              placeholder="Enter Bill ID"
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none w-[130px]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High to Low</option>
              <option value="amount_low">Amount: Low to High</option>
            </select>
          </div>
        </div>
        <div>
          <button className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-[#8B1A1A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-green-500 font-medium">+10.2%</span>
            </div>
            <p className="text-[10px] text-gray-400">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Total Amount Collected</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalCollected)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Pending Amount</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-sm text-gray-900">Transactions</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Sorted by Newest First • Date: all</p>
          </div>
          <button onClick={() => setShowAddPayment(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717]">
            <Plus className="w-3.5 h-3.5" /> Add Payment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">SL NO</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Client Details</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Payment Details</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Amount</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allPayments.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No payments found</td></tr>
              ) : (
                allPayments.map((p, idx) => (
                  <tr key={p.id + idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{p.clientId}</td>
                    <td className="px-4 py-3">
                      <Link to={`/clients/${p.clientId}`} className="font-medium text-gray-900 hover:text-[#8B1A1A]">{p.clientName}</Link>
                      <p className="text-[10px] text-gray-400">{p.clientPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{p.method}</p>
                      <p className="text-[10px] text-gray-400">BILL ID: {p.billRef}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Completed
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {', '}
                      {new Date(p.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/payments/${p.clientId}`} className="flex items-center gap-1 text-[11px] text-[#8B1A1A] hover:underline font-medium px-2 py-1 rounded hover:bg-rose-50">
                          <Eye className="w-3 h-3" /> View
                        </Link>
                        <button onClick={() => setInvoicePayment(p)} className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium px-2 py-1 rounded hover:bg-blue-50">
                          <FileText className="w-3 h-3" /> Invoice
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

      {/* Invoice Modal */}
      {invoicePayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setInvoicePayment(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-w-full max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 print:hidden">
              <h2 className="font-semibold text-sm text-gray-900">Invoice Preview</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717]">
                  <FileText className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button onClick={() => setInvoicePayment(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invoice content (printable) */}
            <div id="invoice-printable" className="px-10 py-8 overflow-y-auto flex-1">
              {/* Company header */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-[#8B1A1A]">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#8B1A1A] rounded flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">DW</span>
                  </div>
                  <div>
                    <h1 className="text-[15px] font-bold text-[#8B1A1A] leading-tight">DESTINATION WEDDING</h1>
                    <p className="text-[9px] text-gray-500 tracking-[0.15em] mt-0.5">MANAGEMENT PORTAL</p>
                    <p className="text-[10px] text-gray-500 mt-2">info@destinationwedding.com</p>
                    <p className="text-[10px] text-gray-500">+91 98765 43210</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-wide">INVOICE</h2>
                  <p className="text-[11px] text-gray-500 mt-1">#{invoicePayment.billRef}</p>
                </div>
              </div>

              {/* Bill To + Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2">Bill To</p>
                  <p className="text-sm font-semibold text-gray-900">{invoicePayment.clientName}</p>
                  <p className="text-xs text-gray-600 mt-1">{invoicePayment.clientPhone}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Client ID: {invoicePayment.clientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2">Invoice Details</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Date:</span><span className="text-gray-900 font-medium">{new Date(invoicePayment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Payment Mode:</span><span className="text-gray-900 font-medium">{invoicePayment.method}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Status:</span><span className="text-green-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Paid</span></div>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="mt-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#8B1A1A] text-white">
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[60px]">#</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider">Description</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[140px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-xs text-gray-600">01</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-gray-900">{invoicePayment.note || 'Wedding Services Payment'}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Payment for destination wedding services</p>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900">{formatCurrency(invoicePayment.amount)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mt-6">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-xs px-4">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(invoicePayment.amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs px-4">
                      <span className="text-gray-500">GST (0%)</span>
                      <span className="text-gray-900 font-medium">₹0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold bg-[#8B1A1A]/10 px-4 py-2.5 rounded mt-2">
                      <span className="text-gray-900">Total Paid</span>
                      <span className="text-[#8B1A1A]">{formatCurrency(invoicePayment.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-5 border-t border-gray-200 text-center">
                <p className="text-[11px] text-gray-600 font-medium">Thank you for your business!</p>
                <p className="text-[10px] text-gray-400 mt-1">This is a computer-generated invoice and does not require a signature.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddPayment(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[15px] text-gray-900">Add Payment</h2>
              <button onClick={() => setShowAddPayment(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Client<span className="text-red-500">*</span></label>
                <select
                  value={paymentForm.clientId}
                  onChange={(e) => setPaymentForm(p => ({ ...p, clientId: e.target.value }))}
                  required
                  className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                >
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.coupleName} ({c.id})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Amount (₹)<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(p => ({ ...p, amount: e.target.value }))}
                    required
                    placeholder="e.g. 100000"
                    className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Date<span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm(p => ({ ...p, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Payment Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm(p => ({ ...p, method: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                  >
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Service / Note</label>
                  <input
                    type="text"
                    value={paymentForm.note}
                    onChange={(e) => setPaymentForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="e.g. Advance"
                    className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowAddPayment(false)} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={handleAddPayment} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
