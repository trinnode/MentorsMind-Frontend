import { useState, useEffect } from 'react';
import type { LearnerOnboardingState, LearnerStepId } from '../types';

const STEPS: LearnerStepId[] = ['goals', 'assessment', 'matching', 'wallet', 'tutorial', 'complete'];
const STORAGE_KEY = 'learner_onboarding_progress';

const INITIAL_STATE: LearnerOnboardingState = {
  currentStep: 'goals',
  completedSteps: [],
  isDismissed: false,
  isCelebrated: false,
  data: {},
};

export const useLearnerOnboarding = () => {
  const [state, setState] = useState<LearnerOnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as LearnerOnboardingState) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const nextStep = () => {
    const idx = STEPS.indexOf(state.currentStep);
    if (idx < STEPS.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: STEPS[idx + 1],
        completedSteps: Array.from(new Set([...prev.completedSteps, prev.currentStep])),
      }));
    }
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(state.currentStep);
    if (idx > 0) setState(prev => ({ ...prev, currentStep: STEPS[idx - 1] }));
  };

  const skipToDashboard = () => setState(prev => ({ ...prev, isDismissed: true }));
  const resumeOnboarding = () => setState(prev => ({ ...prev, isDismissed: false }));

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'complete',
      completedSteps: STEPS.filter(s => s !== 'complete'),
      isCelebrated: true,
    }));
  };

  const updateData = (key: keyof LearnerOnboardingState['data'], value: LearnerOnboardingState['data'][typeof key]) => {
    setState(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
  };

  const resetOnboarding = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const progress = (state.completedSteps.length / (STEPS.length - 1)) * 100;

  return { ...state, steps: STEPS, nextStep, prevStep, skipToDashboard, resumeOnboarding, completeOnboarding, updateData, resetOnboarding, progress };
};
