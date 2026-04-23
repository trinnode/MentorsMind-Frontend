import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  streak: number;
  mntEarned: number;
  avatar: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Chen', streak: 42, mntEarned: 2100, avatar: '👨‍💻' },
  { rank: 2, name: 'Sarah Johnson', streak: 38, mntEarned: 1900, avatar: '👩‍💼' },
  { rank: 3, name: 'Marcus Williams', streak: 35, mntEarned: 1750, avatar: '👨‍🎓' },
  { rank: 4, name: 'Emma Davis', streak: 32, mntEarned: 1600, avatar: '👩‍🔬' },
  { rank: 5, name: 'James Brown', streak: 28, mntEarned: 1400, avatar: '👨‍🏫' },
  { rank: 6, name: 'Lisa Anderson', streak: 25, mntEarned: 1250, avatar: '👩‍💻' },
  { rank: 7, name: 'David Miller', streak: 22, mntEarned: 1100, avatar: '👨‍🎨' },
  { rank: 8, name: 'Jessica Taylor', streak: 20, mntEarned: 1000, avatar: '👩‍🎓' },
  { rank: 9, name: 'Robert Garcia', streak: 18, mntEarned: 900, avatar: '👨‍💼' },
  { rank: 10, name: 'Michelle Lee', streak: 15, mntEarned: 750, avatar: '👩‍🏫' },
];

export default function Leaderboard() {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-6">
        <p className="text-sm opacity-90">Top learners by current streak</p>
        <p className="text-lg font-semibold mt-1">Compete and earn MNT rewards</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Learner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Streak</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">MNT Earned</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry, index) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-gray-100 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-indigo-50`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getMedalIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{entry.avatar}</span>
                      <span className="font-medium text-gray-900">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-600">{entry.streak}</span>
                      <span className="text-orange-500">🔥</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-600">{entry.mntEarned}</span>
                      <span className="text-sm text-gray-500">MNT</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-gray-600 mb-1">🥇 Top Streak</p>
          <p className="text-2xl font-bold text-orange-600">{mockLeaderboard[0].streak} weeks</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
          <p className="text-sm text-gray-600 mb-1">💰 Total MNT Distributed</p>
          <p className="text-2xl font-bold text-indigo-600">
            {mockLeaderboard.reduce((sum, entry) => sum + entry.mntEarned, 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-gray-600 mb-1">👥 Active Learners</p>
          <p className="text-2xl font-bold text-green-600">{mockLeaderboard.length}</p>
        </div>
      </div>
    </div>
  );
}
