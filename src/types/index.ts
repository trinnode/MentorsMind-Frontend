export interface Review {
  id: string;
  mentorId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerified: boolean;
  mentorResponse?: {
    text: string;
    date: string;
  };
  isFlagged?: boolean;
}

export interface RatingDistribution {
  star: number;
  count: number;
}

export interface RatingStats {
  average: number;
  totalReviews: number;
  distribution: RatingDistribution[];
  trends: {
    labels: string[];
    values: number[];
  };
}

export type OnboardingStepId = 'profile' | 'wallet' | 'availability' | 'pricing' | 'tutorial' | 'complete';

export type LearnerStepId = 'goals' | 'assessment' | 'matching' | 'wallet' | 'tutorial' | 'complete';

export interface LearnerGoal {
  id: string;
  label: string;
  icon: string;
}

export interface SkillLevel {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface MentorMatch {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  hourlyRate: number;
  matchScore: number;
  avatar: string;
}

export interface LearnerOnboardingState {
  currentStep: LearnerStepId;
  completedSteps: LearnerStepId[];
  isDismissed: boolean;
  isCelebrated: boolean;
  data: {
    goals?: string[];
    skills?: SkillLevel[];
    selectedMentor?: string;
    wallet?: { address: string; connected: boolean };
  };
}

export interface OnboardingState {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  isDismissed: boolean;
  isCelebrated: boolean;
  data: {
    profile?: {
      bio: string;
      specialization: string;
    };
    wallet?: {
      address: string;
      connected: boolean;
    };
    availability?: {
      timezone: string;
      slots: string[];
    };
    pricing?: {
      hourlyRate: number;
      currency: string;
    };
  };
}
