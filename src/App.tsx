import React, { lazy, useEffect, useState, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useHorizon } from './hooks/useHorizon';
import OfflineBanner from './components/ui/OfflineBanner';
import NetworkErrorToast from './components/ui/NetworkErrorToast';
import SkipNavigation from './components/a11y/SkipNavigation';
import LiveRegion from './components/a11y/LiveRegion';
import AccessibilityPanel from './components/a11y/AccessibilityPanel';
import CookieBanner from './components/compliance/CookieBanner';
import TermsAcceptance from './components/compliance/TermsAcceptance';
import { useReviews } from './hooks/useReviews';
import { usePerformance } from './hooks/usePerformance';
import { preloadCriticalResources } from './utils/performance.utils';
import MetricCard from './components/charts/MetricCard';

const loadMentorOnboarding = () => import('./components/onboarding/MentorOnboarding');
const loadLearnerOnboarding = () => import('./pages/LearnerOnboarding');
const loadMentorWallet = () => import('./pages/MentorWallet');
const loadMentorSearch = () => import('./pages/MentorSearch');
const loadMentorSessions = () => import('./pages/MentorSessions');
const loadSettings = () => import('./pages/Settings');
const loadMentorProfileSetup = () => import('./pages/MentorProfileSetup');
const loadLearningGoals = () => import('./pages/LearningGoals');
const loadGovernance = () => import('./pages/Governance');
const loadProposalDetail = () => import('./pages/ProposalDetail');
const loadRatingBreakdown = () => import('./components/reviews/RatingBreakdown');
const loadReviewForm = () => import('./components/reviews/ReviewForm');
const loadReviewList = () => import('./components/reviews/ReviewList');
const loadLineChart = () => import('./components/charts/LineChart');
const loadBarChart = () => import('./components/charts/BarChart');
const loadPieChart = () => import('./components/charts/PieChart');
const loadAreaChart = () => import('./components/charts/AreaChart');
const loadMentorPublicProfile = () => import('./pages/MentorPublicProfile');
const loadLearnerProfile = () => import('./pages/LearnerProfile');
const loadMentorAnalyticsPage = () => import('./pages/MentorAnalytics');
const loadLearnerAnalyticsPage = () => import('./pages/LearnerAnalytics');
const loadPlatformStats = () => import('./pages/PlatformStats');
const loadPrivacyPolicy = () => import('./pages/PrivacyPolicy');
const loadTermsOfService = () => import('./pages/TermsOfService');
const loadISAMarketplace = () => import('./pages/ISAMarketplace');
const loadPortfolio = () => import('./pages/Portfolio');
const loadTreasuryDashboard = () => import('./pages/TreasuryDashboard');

const MentorPublicProfile = lazy(loadMentorPublicProfile);
const LearnerProfile = lazy(() => loadLearnerProfile().then(m => ({ default: m.LearnerProfilePage })));
const MentorOnboarding = lazy(loadMentorOnboarding);
const LearnerOnboarding = lazy(loadLearnerOnboarding);
const MentorWallet = lazy(loadMentorWallet);
const MentorSearch = lazy(loadMentorSearch);
const MentorSessions = lazy(loadMentorSessions);
const Settings = lazy(loadSettings);
const Governance = lazy(loadGovernance);
const ProposalDetail = lazy(loadProposalDetail);
const MentorProfileSetup = lazy(() => loadMentorProfileSetup().then(m => ({ default: m.MentorProfileSetup })));
const LearningGoals = lazy(loadLearningGoals);
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const RatingBreakdown = lazy(loadRatingBreakdown);
const ReviewForm = lazy(loadReviewForm);
const ReviewList = lazy(loadReviewList);
const LineChart = lazy(loadLineChart);
const BarChart = lazy(loadBarChart);
const PieChart = lazy(loadPieChart);
const AreaChart = lazy(loadAreaChart);
const MentorAnalyticsPage = lazy(loadMentorAnalyticsPage);
const LearnerAnalyticsPage = lazy(loadLearnerAnalyticsPage);
const PlatformStatsPage = lazy(loadPlatformStats);
const PrivacyPolicyPage = lazy(loadPrivacyPolicy);
const TermsOfServicePage = lazy(loadTermsOfService);
const ISAMarketplacePage = lazy(loadISAMarketplace);
const Portfolio = lazy(loadPortfolio);
const TreasuryDashboard = lazy(loadTreasuryDashboard);

const TERMS_ACCEPTANCE_KEY = 'mm_terms_acceptance';
const UNSUPPORTED_COUNTRIES = new Set(['IR', 'KP', 'SY', 'CU']);

type AppView = 'onboarding' | 'learner' | 'wallet' | 'search' | 'reviews' | 'analytics' | 'profile' | 'sessions' | 'settings' | 'goals' | 'dashboard' | 'learner-profile' | 'treasury';

const earningsData = [
  { label: 'Jan', earnings: 1200, sessions: 8 },
  { label: 'Feb', earnings: 1800, sessions: 12 },
  { label: 'Mar', earnings: 1500, sessions: 10 },
  { label: 'Apr', earnings: 2200, sessions: 15 },
  { label: 'May', earnings: 2800, sessions: 18 },
  { label: 'Jun', earnings: 3100, sessions: 21 },
];

const sessionsByCategory = [
  { label: 'Web Dev', value: 42 },
  { label: 'Blockchain', value: 28 },
  { label: 'Design', value: 18 },
  { label: 'DevOps', value: 12 },
];

const ratingTrend = [
  { label: 'Jan', rating: 4.2 },
  { label: 'Feb', rating: 4.4 },
  { label: 'Mar', rating: 4.3 },
  { label: 'Apr', rating: 4.6 },
  { label: 'May', rating: 4.5 },
  { label: 'Jun', rating: 4.8 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const isOnline = useOnlineStatus();
  const perf = usePerformance();

  useEffect(() => {
    const accepted = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
    if (accepted === 'true') {
      setIsTermsAccepted(true);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem(TERMS_ACCEPTANCE_KEY, 'true');
    setIsTermsAccepted(true);
  };

  const preloaders: Record<AppView, () => Promise<any>> = {
    onboarding: loadMentorOnboarding,
    learner: loadLearnerOnboarding,
    wallet: loadMentorWallet,
    search: loadMentorSearch,
    sessions: loadMentorSessions,
    settings: loadSettings,
    analytics: loadMentorAnalyticsPage,
    profile: loadMentorProfileSetup,
    goals: loadLearningGoals,
    reviews: loadReviewList,
    dashboard: () => Promise.resolve(),
    'learner-profile': loadLearnerProfile,
    treasury: loadTreasuryDashboard,
  };

  useEffect(() => {
    preloadCriticalResources();
    Object.values(preloaders).forEach(p => p());
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-gray-900 leading-none">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your sessions.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentView('treasury')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  View Treasury
                </button>
                <button className="px-6 py-3 bg-linear-to-r from-stellar to-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-stellar/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Withdraw Funds
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total Earnings" value="12,450" change={12.5} prefix="$" />
              <MetricCard title="Active Sessions" value="24" change={8.2} />
              <MetricCard title="Avg. Rating" value="4.8" change={2.1} />
              <MetricCard title="Student Reach" value="1,840" change={15.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Earnings Overview</h2>
                  <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-stellar/20">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <AreaChart 
                  data={earningsData as any} 
                  series={[{ key: 'earnings', name: 'Earnings' }]}
                  title="Monthly Revenue"
                />
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
                <h2 className="text-xl font-bold mb-8">Sessions by Topic</h2>
                <PieChart data={sessionsByCategory} title="Topic Distribution" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
                <h2 className="text-xl font-bold mb-8">Rating Trend</h2>
                <LineChart 
                  data={ratingTrend as any} 
                  series={[{ key: 'rating', name: 'Rating' }]}
                  title="Satisfaction Score"
                />
              </div>
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xs overflow-hidden">
                <h2 className="text-xl font-bold mb-8">Recent Reviews</h2>
                <ReviewList 
                  reviews={[]} 
                  stats={{ average: 0, totalReviews: 0, distribution: [], trends: { labels: [], values: [] } }} 
                  onVoteHelpful={() => {}} 
                  onFilterChange={() => {}} 
                  currentFilter={null} 
                  onAddResponse={() => {}} 
                  currentPage={1} 
                  totalPages={1} 
                  onPageChange={() => {}} 
                />
              </div>
            </div>
          </div>
        );
      case 'onboarding': return <MentorOnboarding />;
      case 'learner': return <LearnerOnboarding />;
      case 'wallet': return <MentorWallet />;
      case 'search': return <MentorSearch />;
      case 'sessions': return <MentorSessions />;
      case 'settings': return <Settings />;
      case 'analytics': return <MentorAnalyticsPage />;
      case 'profile': return <MentorProfileSetup />;
      case 'goals': return <LearningGoals />;
      case 'learner-profile': return <LearnerProfile />;
      case 'treasury': return <TreasuryDashboard />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-stellar/10 selection:text-stellar">
      <SkipNavigation />
      {!isOnline && <OfflineBanner />}
      <NetworkErrorToast 
        message="Unable to connect to service" 
        onRetry={() => window.location.reload()} 
        onClose={() => console.log('toast closed')} 
      />
      <LiveRegion message="" />
      
      {!isTermsAccepted && <TermsAcceptance isOpen={!isTermsAccepted} onAccept={handleTermsAccept} />}
      <CookieBanner />

      <main id="main-content" className="relative">
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-stellar/20 border-t-stellar rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={renderView()} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/governance/proposals/:id" element={<ProposalDetail />} />
            <Route path="/treasury" element={<TreasuryDashboard />} />
            <Route path="/learner-profile" element={<LearnerProfile />} />
          </Routes>
        </Suspense>
      </main>

      <AccessibilityPanel isOpen={false} onClose={() => {}} />
    </div>
  );
};

export default App;
