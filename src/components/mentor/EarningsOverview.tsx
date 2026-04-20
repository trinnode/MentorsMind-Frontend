import React from 'react';
import type { EarningsData } from '../../types';

interface EarningsOverviewProps {
  earnings: EarningsData;
  onExport: () => void;
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ earnings, onExport }) => {
  const maxAmount = Math.max(...earnings.history.map(h => h.amount), 1);
  
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Earnings</h3>
          <div className="text-3xl font-black text-gray-900 flex items-baseline gap-1">
            {earnings.totalEarned.toLocaleString()} <span className="text-sm font-bold text-stellar">XLM</span>
          </div>
        </div>
        <button 
          onClick={onExport}
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors group"
          title="Export CSV"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-stellar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5l5 5V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-stellar/10 rounded-2xl p-4 border-2 border-stellar/20 shadow-inner">
          <div className="text-[10px] font-bold text-stellar uppercase mb-1 flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-stellar" />
            Pending Payout
          </div>
          <div className="text-2xl font-black text-gray-900">{earnings.pendingPayout} <span className="text-sm font-bold opacity-50">XLM</span></div>
        </div>
        <div className="flex-1 bg-green-50 rounded-2xl p-4 border border-green-100">
          <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Status</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <div className="text-xs font-bold text-green-700">Healthy</div>
          </div>
        </div>
      </div>

      {/* Simple SVG Bar Chart */}
      <div className="h-40 flex items-end justify-between gap-1 px-2">
        {earnings.history.map((h, i) => {
          const heightPercentage = Math.max((h.amount / maxAmount) * 100, 5);
          return (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div 
                className="w-full bg-stellar/10 group-hover:bg-stellar rounded-t-lg transition-all relative overflow-hidden" 
                style={{ height: `${heightPercentage}%` }}
              >
                <div className="absolute inset-x-0 bottom-0 bg-stellar opacity-20 pointer-events-none" style={{ height: '30%' }} />
                
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {h.amount} XLM
                </div>
              </div>
              <div className="mt-2 text-[8px] font-bold text-gray-400 rotate-45 origin-left">{h.date.split('-').slice(1).join('/')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarningsOverview;
