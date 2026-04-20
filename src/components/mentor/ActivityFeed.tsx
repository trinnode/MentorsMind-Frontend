import React from 'react';
import type { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden">
      <h3 className="text-gray-900 font-bold mb-6">Activity Feed</h3>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-50" />
        
        <div className="space-y-6 relative">
          {activities.length === 0 ? (
            <div className="text-center text-gray-400 text-sm italic py-4">No recent activity.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${
                  activity.type === 'booking' ? 'bg-stellar text-white' : 
                  activity.type === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {activity.type === 'booking' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {activity.type === 'payment' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-13a9 9 0 110 18 9 9 0 010-18zm0 0V5m0 16v-2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {activity.type !== 'booking' && activity.type !== 'payment' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="flex-1 pt-0.5 pb-2">
                  <div className="text-sm font-bold text-gray-900 mb-0.5">{activity.title}</div>
                  <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{activity.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
