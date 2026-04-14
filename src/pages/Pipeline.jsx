import { Link } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { formatCurrency, formatBudgetRange } from '../utils/helpers';
import { Kanban } from 'lucide-react';

export default function Pipeline() {
  const { enquiries, PIPELINE_STAGES, updateEnquiryStatus } = useCRM();

  const stageColors = {
    New: 'border-t-blue-500 bg-blue-50/30',
    Contacted: 'border-t-yellow-500 bg-yellow-50/30',
    'Meeting Scheduled': 'border-t-purple-500 bg-purple-50/30',
    'Proposal Sent': 'border-t-indigo-500 bg-indigo-50/30',
    Negotiation: 'border-t-orange-500 bg-orange-50/30',
    Converted: 'border-t-green-500 bg-green-50/30',
    Lost: 'border-t-red-500 bg-red-50/30',
  };

  const handleDragStart = (e, enquiryId) => e.dataTransfer.setData('enquiryId', enquiryId);
  const handleDrop = (e, stage) => {
    e.preventDefault();
    const enquiryId = e.dataTransfer.getData('enquiryId');
    if (enquiryId) updateEnquiryStatus(enquiryId, stage);
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#8B1A1A] rounded-lg flex items-center justify-center">
          <Kanban className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">SALES PIPELINE</h1>
          <p className="text-xs text-gray-500">Drag and drop enquiries between stages</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {PIPELINE_STAGES.map(stage => {
          const stageEnquiries = enquiries.filter(e => e.status === stage);
          const totalBudget = stageEnquiries.reduce((sum, e) => sum + e.estimatedBudget, 0);

          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-64 rounded-xl border border-gray-200 border-t-4 ${stageColors[stage]} flex flex-col`}
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
            >
              <div className="p-3 border-b border-gray-200/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-xs text-gray-900">{stage}</h3>
                  <span className="bg-white text-[10px] font-bold text-gray-600 px-1.5 py-0.5 rounded-full border border-gray-200">
                    {stageEnquiries.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{formatCurrency(totalBudget)}</p>
              </div>

              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {stageEnquiries.map(e => (
                  <Link
                    key={e.id}
                    to={`/enquiries/${e.id}`}
                    draggable
                    onDragStart={(ev) => handleDragStart(ev, e.id)}
                    className="block bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                  >
                    <p className="font-medium text-xs text-gray-900">{e.coupleName}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{e.destination}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-semibold text-gray-700">{formatBudgetRange(e.estimatedBudget)}</span>
                      <span className="text-[10px] text-gray-400">{e.guestCount ? `${e.guestCount}g` : ''}</span>
                    </div>
                    {e.nextFollowUp && (
                      <p className="text-[10px] text-[#8B1A1A] mt-1">Follow-up: {new Date(e.nextFollowUp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    )}
                  </Link>
                ))}
                {stageEnquiries.length === 0 && (
                  <p className="text-center text-[10px] text-gray-400 py-6">Drop here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
