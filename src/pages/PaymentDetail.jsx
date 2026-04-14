import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ArrowLeft, FileText } from 'lucide-react';

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useCRM();
  const client = clients.find(c => c.id === id);

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
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
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
    </div>
  );
}
