import { useState, useEffect } from 'react';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  weeklyActivity: boolean[]; // Last 12 weeks
  mntRewardsEarned: number;
  sessionsToMilestone: number;
  milestoneReward: number;
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 8,
    longestStreak: 15,
    lastSessionDate: new Date().toISOString().split('T')[0],
    weeklyActivity: [true, true, false, true, true, true, false, true, true, true, false, true],
    mntRewardsEarned: 450,
    sessionsToMilestone: 2,
    milestoneReward: 100,
  });

  const [streakBroken, setStreakBroken] = useState(false);

  useEffect(() => {
    // Simulate checking if streak is broken
    // In a real app, this would check against backend data
    const checkStreakStatus = () => {
      const lastSession = streak.lastSessionDate ? new Date(streak.lastSessionDate) : null;
      if (lastSession) {
        const today = new Date();
        const daysSinceLastSession = Math.floor(
          (today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastSession > 1) {
          setStreakBroken(true);
        }
      }
    };

    checkStreakStatus();
  }, [streak.lastSessionDate]);

  const claimRewards = () => {
    // In a real app, this would call an API endpoint
    console.log('Claiming rewards:', streak.mntRewardsEarned);
    setStreak(prev => ({
      ...prev,
      mntRewardsEarned: 0,
    }));
  };

  const resetStreak = () => {
    setStreak(prev => ({
      ...prev,
      currentStreak: 0,
      lastSessionDate: null,
    }));
    setStreakBroken(false);
  };

  return {
    streak,
    streakBroken,
    claimRewards,
    resetStreak,
  };
}
