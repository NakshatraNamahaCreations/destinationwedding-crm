import { Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatDateTime } from '../utils/helpers';
import { Bell, CheckCheck, Clock, AlertTriangle, Calendar } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCRM();
  const unread = notifications.filter(n => !n.read);

  const getIcon = (type) => {
    switch (type) {
      case 'follow_up': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'missed': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'upcoming_wedding': return <Calendar className="w-4 h-4 text-rose-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLink = (n) => {
    if (n.enquiryId) return `/enquiries/${n.enquiryId}`;
    if (n.clientId) return `/clients/${n.clientId}`;
    return '#';
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8B1A1A] rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">NOTIFICATIONS</h1>
            <p className="text-xs text-gray-500">{unread.length} unread</p>
          </div>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 rounded-lg font-medium">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">No notifications</p>
        ) : (
          notifications.map(n => (
            <Link
              key={n.id}
              to={getLink(n)}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-rose-50/40' : ''}`}
            >
              <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-[#8B1A1A] rounded-full shrink-0 mt-1.5" />}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
