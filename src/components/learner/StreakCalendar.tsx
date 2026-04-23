import { useStreak } from '../../hooks/useStreak';

export default function StreakCalendar() {
  const { streak } = useStreak();

  const getWeekLabel = (index: number) => {
    const weeksAgo = 11 - index;
    if (weeksAgo === 0) return 'This week';
    if (weeksAgo === 1) return 'Last week';
    return `${weeksAgo}w ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity (Last 12 Weeks)</h3>
      <div className="grid grid-cols-12 gap-2">
        {streak.weeklyActivity.map((active, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-lg transition-all ${
                active
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md'
                  : 'bg-gray-100 border border-gray-200'
              }`}
              title={`${getWeekLabel(index)}: ${active ? 'Active' : 'No activity'}`}
            />
            <span className="text-xs text-gray-500 text-center">{getWeekLabel(index)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-green-600" />
          <span className="text-gray-600">Active week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
          <span className="text-gray-600">No activity</span>
        </div>
      </div>
    </div>
  );
}
