import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency } from '../utils/helpers';
import { Download, IndianRupee, TrendingUp, TrendingDown, Eye, ArrowLeft } from 'lucide-react';

export default function BudgetReport() {
  const navigate = useNavigate();
  const { clients } = useCRM();

  const totalBudget = clients.reduce((sum, c) => sum + c.budget, 0);
  const totalCollected = clients.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalPending = totalBudget - totalCollected;
  const collectionRate = totalBudget > 0 ? Math.round((totalCollected / totalBudget) * 100) : 0;

  const clientBudgets = useMemo(() => {
    return clients.map(c => ({
      ...c,
      paid: c.totalPaid,
      pending: c.budget - c.totalPaid,
      progress: c.budget > 0 ? Math.round((c.totalPaid / c.budget) * 100) : 0,
    })).sort((a, b) => b.budget - a.budget);
  }, [clients]);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">BUDGET REPORT</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track budget allocation and collection across all clients</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Total Budget</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Collected</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalCollected)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Pending</p>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(totalPending)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">%</span>
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Collection Rate</p>
            <p className="text-lg font-bold text-blue-600">{collectionRate}%</p>
          </div>
        </div>
      </div>

      {/* Client Budget Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-900">Client Budget Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">SL NO</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Client</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Destination</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Total Budget</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Collected</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Pending</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Progress</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientBudgets.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No clients found</td></tr>
              ) : (
                clientBudgets.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.coupleName}</p>
                      <p className="text-[10px] text-gray-400">{c.id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.destination}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(c.budget)}</td>
                    <td className="px-4 py-3 font-medium text-green-600">{formatCurrency(c.paid)}</td>
                    <td className="px-4 py-3 font-medium text-amber-600">{formatCurrency(c.pending)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(c.progress, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-500">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/payments/${c.id}`} className="flex items-center gap-1 text-[11px] text-[#8B1A1A] hover:underline font-medium px-2 py-1 rounded hover:bg-rose-50">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
