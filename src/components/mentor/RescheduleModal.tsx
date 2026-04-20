import React, { useState, FormEvent, MouseEvent } from 'react';
import type { SessionStatus } from '../../types';
import { useMentorSessions } from '../../hooks/useMentorSessions';

interface RescheduleModalProps {
  sessionId: string;
  currentTime: string;
  isOpen: boolean;
  onClose: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ 
  sessionId, 
  currentTime, 
  isOpen, 
  onClose 
}) => {
  const { reschedule } = useMentorSessions();
  const [newDateTime, setNewDateTime] = useState<string>(currentTime);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      reschedule(sessionId, newDateTime);
      setLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto" 
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Reschedule Session</h2>
          <p className="text-gray-600">Choose new date and time</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Date & Time</label>
            <input
              type="datetime-local"
              value={newDateTime.slice(0, 16)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDateTime(e.target.value + ':00')}
              min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)} // 1 hour minimum notice
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-stellar focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="e.g., Time zone conflict, conflicting appointment..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-vertical focus:ring-2 focus:ring-stellar focus:border-transparent transition-all shadow-sm max-h-32"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => onClose()}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" pathLength="0.4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Rescheduling...
                </>
              ) : (
                'Reschedule Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;

