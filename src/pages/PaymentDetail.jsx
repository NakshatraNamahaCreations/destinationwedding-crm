import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ArrowLeft, FileText, X } from 'lucide-react';

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useCRM();
  const client = clients.find(c => c.id === id);
  const [showInvoice, setShowInvoice] = useState(false);

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Client not found</p>
        <Link to="/payments" className="text-[#8B1A1A] text-sm mt-2 inline-block">Back to payments</Link>
      </div>
    );
  }

  const balance = client.budget - client.totalPaid;
  const isPaid = balance <= 0;

  // Group payments by method
  const methodTotals = {};
  client.payments.forEach(p => {
    if (!methodTotals[p.method]) methodTotals[p.method] = 0;
    methodTotals[p.method] += p.amount;
  });

  const firstPayment = client.payments.length > 0
    ? client.payments.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b)
    : null;
  const latestPayment = client.payments.length > 0
    ? client.payments.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b)
    : null;

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/payments')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Profile Header */}
      <div className="bg-[#2d2d3d] rounded-xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-[#8B1A1A] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">{client.coupleName.charAt(0)}{client.coupleName.split('&')[1]?.trim().charAt(0) || ''}</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white italic">{client.coupleName}</h1>
          <p className="text-[11px] text-gray-400">Client ID: {client.id}</p>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] text-gray-400 uppercase">Total Amount</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(client.budget)}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">Total value after all the customizations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[10px] text-gray-400 uppercase">Amount Paid</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(client.totalPaid)}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">Through {client.payments.length} Payment{client.payments.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 relative">
          {isPaid && (
            <span className="absolute top-3 right-3 text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Paid</span>
          )}
          <p className="text-[10px] text-gray-400 uppercase">Balance</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(Math.max(balance, 0))}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">{isPaid ? 'Payment Complete' : 'Remaining balance'}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-900">Payment History</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">{client.payments.length} Payment{client.payments.length !== 1 ? 's' : ''} Recorded</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">SL NO</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Payment Details</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Payment Mode</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Transaction Info</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {client.payments.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No payments recorded</td></tr>
              ) : (
                client.payments.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700">Payment #{String(idx + 123)}</td>
                    <td className="px-4 py-3 text-gray-700">{p.method}</td>
                    <td className="px-4 py-3 text-gray-500">{p.note || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {', '}
                      {new Date(p.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Completed
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(p.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        {client.payments.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">Showing {client.payments.length} Payment{client.payments.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-6 text-xs">
              <div className="text-right">
                <span className="text-gray-400">Total Payment: </span>
                <span className="font-semibold text-gray-900">{formatCurrency(client.totalPaid)}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Balance: </span>
                <span className="font-semibold text-gray-900">{formatCurrency(Math.max(balance, 0))}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Button */}
      <button onClick={() => setShowInvoice(true)} disabled={client.payments.length === 0} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <FileText className="w-3.5 h-3.5" /> Invoice
      </button>

      {/* Payment Methods + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Payment Methods</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {Object.entries(methodTotals).map(([method, total]) => (
              <div key={method} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-gray-700">{method} ({client.payments.filter(p => p.method === method).length})</span>
                <span className="text-xs font-medium text-gray-900">{formatCurrency(total)}</span>
              </div>
            ))}
            {Object.keys(methodTotals).length === 0 && (
              <p className="px-5 py-4 text-xs text-gray-400">No payments</p>
            )}
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Payment Timeline</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">First Payment</span>
              <span className="text-[11px] font-medium text-gray-900">
                {firstPayment ? `${new Date(firstPayment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date(firstPayment.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Latest Payment</span>
              <span className="text-[11px] font-medium text-gray-900">
                {latestPayment ? `${new Date(latestPayment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date(latestPayment.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Payment Frequency</span>
              <span className="text-[11px] font-medium text-gray-900">{client.payments.length} Payment{client.payments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice / Statement Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInvoice(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[760px] max-w-full max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 print:hidden">
              <h2 className="font-semibold text-sm text-gray-900">Payment Statement Preview</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717]">
                  <FileText className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button onClick={() => setShowInvoice(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Statement content (printable) */}
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
                  <h2 className="text-2xl font-bold text-gray-900 tracking-wide">STATEMENT</h2>
                  <p className="text-[11px] text-gray-500 mt-1">Client: {client.id}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Generated: {formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              {/* Bill To + Summary */}
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2">Bill To</p>
                  <p className="text-sm font-semibold text-gray-900">{client.coupleName}</p>
                  <p className="text-xs text-gray-600 mt-1">{client.phone}</p>
                  {client.email && <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>}
                  {client.destination && <p className="text-xs text-gray-500 mt-0.5">Destination: {client.destination}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2">Summary</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Total Budget:</span><span className="text-gray-900 font-medium">{formatCurrency(client.budget)}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Total Paid:</span><span className="text-green-600 font-medium">{formatCurrency(client.totalPaid)}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Balance:</span><span className="text-amber-600 font-semibold">{formatCurrency(Math.max(balance, 0))}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-gray-400">Status:</span>{isPaid ? <span className="text-green-600 font-semibold">Paid in Full</span> : <span className="text-amber-600 font-semibold">Partial</span>}</div>
                  </div>
                </div>
              </div>

              {/* Payment line items */}
              <div className="mt-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#8B1A1A] text-white">
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[50px]">#</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider">Description</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[110px]">Method</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[110px]">Date</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider w-[120px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...client.payments].sort((a, b) => new Date(a.date) - new Date(b.date)).map((p, idx) => (
                      <tr key={p.id || idx} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-xs text-gray-600">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-4 py-3 text-xs text-gray-900">{p.note || 'Wedding Services Payment'}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{p.method}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(p.date)}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900">{formatCurrency(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mt-6">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-xs px-4">
                      <span className="text-gray-500">Subtotal Paid</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(client.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between text-xs px-4">
                      <span className="text-gray-500">Total Budget</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(client.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold bg-[#8B1A1A]/10 px-4 py-2.5 rounded mt-2">
                      <span className="text-gray-900">Balance Due</span>
                      <span className="text-[#8B1A1A]">{formatCurrency(Math.max(balance, 0))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-5 border-t border-gray-200 text-center">
                <p className="text-[11px] text-gray-600 font-medium">Thank you for your business!</p>
                <p className="text-[10px] text-gray-400 mt-1">This is a computer-generated statement and does not require a signature.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
