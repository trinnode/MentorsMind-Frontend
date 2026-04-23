import { Gift } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak';
import Button from '../ui/Button';

export default function MilestoneProgress() {
  const { streak, claimRewards } = useStreak();

  const totalSessions = 10;
  const completedSessions = totalSessions - streak.sessionsToMilestone;
  const progressPercentage = (completedSessions / totalSessions) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Milestone Progress</h3>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
          <Gift className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-700">{streak.milestoneReward} MNT</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {completedSessions}/{totalSessions} sessions
          </span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {streak.sessionsToMilestone} more session{streak.sessionsToMilestone !== 1 ? 's' : ''} to earn{' '}
        <span className="font-semibold text-indigo-600">{streak.milestoneReward} MNT bonus</span>
      </p>

      {streak.mntRewardsEarned > 0 && (
        <Button
          onClick={claimRewards}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold"
        >
          Claim {streak.mntRewardsEarned} MNT Rewards
        </Button>
      )}
    </div>
  );
}
