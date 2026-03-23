import React from 'react';
import OnboardingStep from './OnboardingStep';
import type { MentorMatch } from '../../types';

const MOCK_MENTORS: MentorMatch[] = [
  { id: 'm1', name: 'Alex Rivera', specialization: 'Blockchain & DeFi', rating: 4.9, hourlyRate: 80, matchScore: 97, avatar: 'AR' },
  { id: 'm2', name: 'Priya Nair', specialization: 'Smart Contracts', rating: 4.8, hourlyRate: 65, matchScore: 91, avatar: 'PN' },
  { id: 'm3', name: 'Jordan Lee', specialization: 'React & Web3', rating: 4.7, hourlyRate: 55, matchScore: 85, avatar: 'JL' },
  { id: 'm4', name: 'Sam Chen', specialization: 'UI/UX & Design', rating: 4.6, hourlyRate: 50, matchScore: 78, avatar: 'SC' },
];

interface MentorMatchingProps {
  selectedMentor?: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const MentorMatching: React.FC<MentorMatchingProps> = ({ selectedMentor, onSelect, onNext, onBack, onSkip }) => {
  return (
    <OnboardingStep
      title="Your Mentor Matches"
      description="Based on your goals and skills, here are your top mentor recommendations."
      onNext={onNext}
      onBack={onBack}
      onSkip={onSkip}
      isNextDisabled={!selectedMentor}
      nextLabel="Choose This Mentor"
    >
      <div className="space-y-3">
        {MOCK_MENTORS.map(mentor => {
          const isSelected = selectedMentor === mentor.id;
          return (
            <button
              key={mentor.id}
              onClick={() => onSelect(mentor.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected ? 'border-stellar bg-stellar/5' : 'border-gray-100 hover:border-stellar/30'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-stellar/10 text-stellar font-bold flex items-center justify-center text-sm shrink-0">
                {mentor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{mentor.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stellar/10 text-stellar">
                    {mentor.matchScore}% match
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{mentor.specialization}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-gray-900">${mentor.hourlyRate}/hr</div>
                <div className="text-xs text-amber-500">★ {mentor.rating}</div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-stellar flex items-center justify-center text-white text-xs shrink-0">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </OnboardingStep>
  );
};

export default MentorMatching;
