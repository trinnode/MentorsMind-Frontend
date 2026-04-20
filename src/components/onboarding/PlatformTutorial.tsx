import React, { useState } from 'react';
import OnboardingStep from './OnboardingStep';

const SLIDES = [
  {
    icon: '🔍',
    title: 'Discover Mentors',
    body: 'Browse verified mentors by skill, rating, and price. Filter by availability to find the perfect fit.',
  },
  {
    icon: '📅',
    title: 'Book Sessions',
    body: 'Schedule 1-on-1 sessions directly from a mentor\'s profile. Payments are held in escrow until the session ends.',
  },
  {
    icon: '💬',
    title: 'Learn & Grow',
    body: 'Join live video sessions, share code, and get real-time feedback from your mentor.',
  },
  {
    icon: '⭐',
    title: 'Rate & Review',
    body: 'After each session, leave a review to help the community and earn platform reputation points.',
  },
];

interface PlatformTutorialProps {
  onNext: () => void;
  onBack: () => void;
}

const PlatformTutorial: React.FC<PlatformTutorialProps> = ({ onNext, onBack }) => {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    <OnboardingStep
      title="How It Works"
      description="A quick walkthrough of the MentorMinds platform."
      onNext={isLast ? onNext : () => setSlide(s => s + 1)}
      onBack={slide === 0 ? onBack : () => setSlide(s => s - 1)}
      nextLabel={isLast ? 'Finish Tutorial' : 'Next'}
    >
      <div className="flex flex-col items-center text-center py-6 min-h-[260px] justify-center animate-in fade-in duration-300">
        <div className="text-6xl mb-6">{current.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{current.title}</h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">{current.body}</p>

        {/* Slide dots */}
        <div className="flex gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${i === slide ? 'bg-stellar w-5' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </OnboardingStep>
  );
};

export default PlatformTutorial;
