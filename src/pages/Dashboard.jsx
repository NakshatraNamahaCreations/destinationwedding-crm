import { Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatDate, formatBudgetRange, isToday, isPast, daysUntil, getStatusColor } from '../utils/helpers';
import { Users, UserCheck, IndianRupee, TrendingUp, Plus, Eye, ArrowRight, Calendar, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { enquiries, clients } = useCRM();

  const totalEnquiries = enquiries.length;
  const activeClients = clients.filter(c => c.status !== 'Completed').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalPaid, 0);
  const converted = enquiries.filter(e => e.status === 'Converted').length;
  const conversionRate = totalEnquiries > 0 ? ((converted / totalEnquiries) * 100).toFixed(0) : 0;

  const newEnquiries = enquiries.filter(e => e.status === 'New').length;
  const needFollowUp = enquiries.filter(e => (isToday(e.nextFollowUp) || isPast(e.nextFollowUp)) && e.status !== 'Converted' && e.status !== 'Lost').length;
  const convertedCount = enquiries.filter(e => e.status === 'Converted').length;
  const lostCount = enquiries.filter(e => e.status === 'Lost').length;

  const activeClientsList = clients.filter(c => c.status !== 'Completed');
  const upcomingWeddings = clients
    .filter(c => daysUntil(c.weddingDate) >= 0 && daysUntil(c.weddingDate) <= 90)
    .sort((a, b) => new Date(a.weddingDate) - new Date(b.weddingDate));
  const recentEnquiries = [...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const stats = [
    { label: 'Total Enquiries', value: totalEnquiries, change: '+9%', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Active Clients', value: activeClients, change: '+8.2%', icon: UserCheck, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+10.2%', icon: IndianRupee, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    { label: 'Lead Conversion Rate', value: `${conversionRate}%`, change: '-2%', icon: TrendingUp, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', negative: true },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">DASHBOARD</h1>
        <p className="text-xs text-gray-500 mt-0.5">Operational insights and performance tracking for seamless wedding execution</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, iconBg, iconColor, negative }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <span className={`text-[11px] font-medium ${negative ? 'text-red-500' : 'text-green-500'}`}>
                  {change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row - Active Clients + Enquiry Summary + Upcoming Weddings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Clients Table */}
        <div className="bg-white rounded-xl border border-gray-200 lg:col-span-1">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-sm text-gray-900">Active Clients</h2>
            <Link to="/clients" className="text-[11px] text-[#8B1A1A] font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2 font-semibold text-gray-500 uppercase text-[10px]">Couple Details</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase text-[10px]">Destination</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeClientsList.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5">
                      <Link to={`/clients/${c.id}`} className="font-medium text-gray-900 hover:text-[#8B1A1A]">{c.coupleName}</Link>
                      <p className="text-[10px] text-gray-400">{c.phone}</p>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{c.destination}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enquiries Summary + Upcoming Weddings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Enquiry Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-gray-900">Enquiries</h2>
              <Link to="/enquiries" className="text-[11px] text-[#8B1A1A] font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-blue-700">{newEnquiries}</p>
                <p className="text-[10px] text-blue-600 font-medium mt-0.5">New Enquiries</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-amber-700">{needFollowUp}</p>
                <p className="text-[10px] text-amber-600 font-medium mt-0.5">Need Follow up</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-700">{convertedCount}</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">Converted</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-red-700">{lostCount}</p>
                <p className="text-[10px] text-red-600 font-medium mt-0.5">Lost/Dropped</p>
              </div>
            </div>
          </div>

          {/* Upcoming Weddings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-sm text-gray-900 mb-3">Upcoming Weddings</h2>
            {upcomingWeddings.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">No upcoming weddings</p>
            ) : (
              <div className="space-y-3">
                {upcomingWeddings.slice(0, 3).map(c => (
                  <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-[#8B1A1A] rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{c.coupleName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{c.coupleName}</p>
                      <p className="text-[10px] text-gray-500">{c.events.length > 0 ? c.events[0].venue : c.destination}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                        {daysUntil(c.weddingDate)} days
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        {formatDate(c.weddingDate)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom - Recent Enquiries */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-900">Recent Enquiries</h2>
          <Link to="/enquiries/new" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Enquiry
          </Link>
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
              {recentEnquiries.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono">{e.id}</td>
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
                    <Link to={`/enquiries/${e.id}`} className="flex items-center gap-1 text-[#8B1A1A] hover:underline font-medium">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
