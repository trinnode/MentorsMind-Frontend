import React from 'react';

interface PerformanceMetricsProps {
  metrics: {
    averageRating: number;
    completionRate: number;
    totalSessions: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 font-bold">Performance Metrics</h3>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Average Rating</div>
            <div className="text-xl font-black text-gray-900">{metrics.averageRating} <span className="text-yellow-400">★</span></div>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full" 
              style={{ width: `${(metrics.averageRating / 5) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Completion Rate</div>
            <div className="text-xl font-black text-gray-900">{metrics.completionRate}%</div>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
            <span className="text-gray-500">Total Hosted Sessions</span>
            <span className="font-bold text-gray-900">{metrics.totalSessions}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
