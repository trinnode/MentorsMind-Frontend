import { Flame } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak';

export default function StreakWidget() {
  const { streak } = useStreak();

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
        <span className="text-4xl font-bold text-orange-600">{streak.currentStreak}</span>
      </div>
      <p className="text-lg font-semibold text-gray-800 mb-2">{streak.currentStreak} week streak!</p>
      <p className="text-sm text-gray-600">
        Personal best: <span className="font-semibold text-orange-600">{streak.longestStreak} weeks</span>
      </p>
    </div>
  );
}
