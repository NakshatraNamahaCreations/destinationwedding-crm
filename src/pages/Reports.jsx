import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate, getStatusColor, formatBudgetRange } from '../utils/helpers';
import { Download, Search, Heart, UserCheck, Clock, XCircle, Eye, ArrowLeft } from 'lucide-react';

export default function Reports() {
  const navigate = useNavigate();
  const { enquiries, LEAD_SOURCES } = useCRM();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const totalEnquiries = enquiries.length;
  const converted = enquiries.filter(e => e.status === 'Converted').length;
  const followUp = enquiries.filter(e => e.status !== 'Converted' && e.status !== 'Lost' && e.status !== 'New').length;
  const lost = enquiries.filter(e => e.status === 'Lost').length;

  const filtered = useMemo(() => {
    let result = enquiries.filter(e => {
      const matchSearch = !search || e.coupleName.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search) || e.id.toLowerCase().includes(search.toLowerCase());
      const matchType = !typeFilter || e.leadSource === typeFilter;
      return matchSearch && matchType;
    });
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return result;
  }, [enquiries, search, typeFilter, sortBy]);

  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none min-w-[120px]";

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ENQUIRY REPORT</h1>
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
            <label className="block text-[10px] text-gray-500 mb-1">Enquiry Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
              <option value="">All</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-green-500 font-medium">+10.2%</span>
            </div>
            <p className="text-[10px] text-gray-400">Total Enquiries</p>
            <p className="text-lg font-bold text-gray-900">{totalEnquiries}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-green-500 font-medium">+10.2%</span>
            </div>
            <p className="text-[10px] text-gray-400">Converted</p>
            <p className="text-lg font-bold text-gray-900">{converted}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Follow-Up</p>
            <p className="text-lg font-bold text-gray-900">{followUp}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Lost/Dropped</p>
            <p className="text-lg font-bold text-gray-900">{lost}</p>
          </div>
        </div>
      </div>

      {/* Enquiries List Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-900">Enquiries List</h2>
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
                      <Link to={`/enquiries/${e.id}`} className="flex items-center gap-1 text-[11px] text-[#8B1A1A] hover:underline font-medium px-2 py-1 rounded hover:bg-rose-50">
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
