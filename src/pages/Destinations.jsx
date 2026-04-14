import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import { MapPin, Plus, Trash2, ArrowLeft, X } from 'lucide-react';

export default function Destinations() {
  const navigate = useNavigate();
  const { DESTINATIONS, addDestination, deleteDestination } = useCRM();
  const [showAdd, setShowAdd] = useState(false);
  const [newDest, setNewDest] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = () => {
    const name = newDest.trim();
    if (name) {
      addDestination(name);
      setNewDest('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">DESTINATIONS</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage wedding destinations available for enquiries</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#7A1717] transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Destination
        </button>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[15px] text-gray-900">Add Destination</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5">
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Destination Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newDest}
                onChange={(e) => setNewDest(e.target.value)}
                placeholder="e.g. Rishikesh"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full px-3 py-2.5 bg-[#f9f9f9] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#7A1717]">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-[15px] text-gray-900">Delete Destination</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget}</span>?
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">No, Cancel</button>
              <button onClick={() => { deleteDestination(deleteTarget); setDeleteTarget(null); }} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Destinations Grid */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-900">{DESTINATIONS.length} Destinations</h2>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {DESTINATIONS.map(d => (
            <div key={d} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 group hover:border-[#8B1A1A]/30 hover:bg-rose-50/30 transition-colors">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#8B1A1A]" />
                <span className="text-sm font-medium text-gray-800">{d}</span>
              </div>
              <button
                onClick={() => setDeleteTarget(d)}
                className="p-1 rounded hover:bg-red-100 text-gray-300 group-hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
