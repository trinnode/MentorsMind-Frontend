import React from 'react';
import OnboardingStep from './OnboardingStep';
import type { SkillLevel } from '../../types';

const TOPICS = ['JavaScript', 'Blockchain', 'Smart Contracts', 'React', 'Python', 'DeFi', 'UI/UX Design', 'DevOps'];
const LEVELS: SkillLevel['level'][] = ['beginner', 'intermediate', 'advanced'];

const LEVEL_STYLES: Record<SkillLevel['level'], string> = {
  beginner: 'bg-blue-50 border-blue-200 text-blue-700',
  intermediate: 'bg-amber-50 border-amber-200 text-amber-700',
  advanced: 'bg-green-50 border-green-200 text-green-700',
};

interface SkillAssessmentProps {
  skills: SkillLevel[];
  onUpdate: (skills: SkillLevel[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const SkillAssessment: React.FC<SkillAssessmentProps> = ({ skills, onUpdate, onNext, onBack, onSkip }) => {
  const getLevel = (topic: string) => skills.find(s => s.topic === topic)?.level;

  const setLevel = (topic: string, level: SkillLevel['level']) => {
    const updated = skills.filter(s => s.topic !== topic);
    onUpdate([...updated, { topic, level }]);
  };

  return (
    <OnboardingStep
      title="Assess Your Skills"
      description="Rate your current knowledge so we can find the right mentors for you."
      onNext={onNext}
      onBack={onBack}
      onSkip={onSkip}
    >
      <div className="space-y-3">
        {TOPICS.map(topic => (
          <div key={topic} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-stellar/20 transition-colors">
            <span className="text-sm font-semibold text-gray-800 w-36">{topic}</span>
            <div className="flex gap-2">
              {LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setLevel(topic, level)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize transition-all ${
                    getLevel(topic) === level
                      ? LEVEL_STYLES[level]
                      : 'border-gray-100 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OnboardingStep>
  );
};

export default SkillAssessment;
