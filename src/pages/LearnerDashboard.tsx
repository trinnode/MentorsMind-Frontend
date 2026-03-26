import React, { useState, useEffect } from 'react';
import { useReminders } from '../hooks/useReminders';
import ReminderSettings from '../components/learner/ReminderSettings';
import UpcomingReminders from '../components/learner/UpcomingReminders';
import LearningRecommendations from '../components/learner/LearningRecommendations';
import SessionPrep from '../components/learner/SessionPrep';
import type { Session } from '../types';
import { useSessionCountdown } from '../hooks/useSessionCountdown';
import SessionCountdown from '../components/mentor/SessionCountdown';

const POLL_INTERVAL_MS = 30_000;

// Mock sessions for demonstration
const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'React Design Patterns & Clean Code',
    startTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    duration: 60,
    status: 'confirmed',
    price: 50,
    currency: 'XLM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 's2',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'Advanced TypeScript: Utility Types',
    startTime: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    duration: 45,
    status: 'pending',
    price: 40,
    currency: 'USDC',
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'cancelled': return 'bg-gray-400';
    default: return 'bg-gray-300';
  }
};

const statusTextColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'text-green-600';
    case 'pending': return 'text-yellow-600';
    case 'cancelled': return 'text-gray-500';
    default: return 'text-gray-400';
  }
};

interface SessionRowProps {
  session: Session;
}

const SessionRow: React.FC<SessionRowProps> = ({ session }) => {
  const countdown = useSessionCountdown(session.startTime);
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500 ${statusColor(session.status)} ${session.status === 'confirmed' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${statusTextColor(session.status)}`}>
            {session.status}
          </span>
          {countdown.isWithinOneHour && (
            <SessionCountdown startTime={session.startTime} />
          )}
        </div>
        <p className="text-sm font-bold text-gray-900 truncate">{session.topic}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(session.startTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          {' · '}{session.duration}min
        </p>
      </div>
      {session.meetingLink && session.status === 'confirmed' && (
        <a
          href={session.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-all flex-shrink-0"
        >
          Join
        </a>
      )}
    </div>
  );
};

const LearnerDashboard: React.FC = () => {
  const {
    settings,
    upcomingReminders,
    history,
    updateSettings,
    snoozeReminder,
    dismissReminder,
    addCustomTime,
    removeCustomTime,
  } = useReminders(MOCK_SESSIONS);

  const [sessions] = useState<Session[]>(MOCK_SESSIONS);
  const [lastPolled, setLastPolled] = useState<Date>(new Date());

  // Poll every 30s (simulated — re-stamps lastPolled)
  useEffect(() => {
    const interval = setInterval(() => {
      // In production: fetch updated sessions from API here
      setLastPolled(new Date());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const nextSession = sessions.find((s: Session) => s.status !== 'cancelled' && new Date(s.startTime) > new Date());
  const nextCountdown = useSessionCountdown(nextSession?.startTime ?? new Date(0).toISOString());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
      {/* Starting soon banner */}
      {nextSession && nextCountdown.isStartingSoon && !nextCountdown.isStarted && (
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          Session starting soon — "{nextSession.topic}" begins in under 15 minutes.
          {nextSession.meetingLink && (
            <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer" className="ml-auto px-3 py-1 bg-amber-500 text-white rounded-xl text-xs hover:bg-amber-600 transition-all">
              Join Now
            </a>
          )}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-stellar">Emma</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            You have {sessions.filter((s: Session) => s.status !== 'cancelled').length} upcoming sessions this week.
          </p>
          {/* Polling indicator */}
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live · Updated {lastPolled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 font-bold">128</div>
            <div className="text-xs">
              <div className="font-bold text-gray-900 leading-none">XLM</div>
              <div className="text-gray-400">Balance</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          {/* Live session status list */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Your Sessions</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            {sessions.map((s: Session) => <SessionRow key={s.id} session={s} />)}
          </div>

          <UpcomingReminders
            reminders={upcomingReminders}
            history={history}
            onSnooze={(id: string) => snoozeReminder(id)}
            onDismiss={(id: string) => dismissReminder(id)}
          />

          <div className="bg-gradient-to-br from-stellar to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-stellar/20">
            <h3 className="text-xl font-bold mb-2">Prepare for your next session</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Preparation is key to a successful mentoring session. Review these tips to make the most of your time.
            </p>
            <button className="w-full py-3 bg-white text-stellar font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95">
              Prep Toolkit
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ReminderSettings
            settings={settings}
            onUpdate={updateSettings}
            onAddCustomTime={addCustomTime}
            onRemoveCustomTime={removeCustomTime}
          />
        </div>
      </div>

      <LearningRecommendations />
      <SessionPrep />
    </div>
  );
};

export default LearnerDashboard;
