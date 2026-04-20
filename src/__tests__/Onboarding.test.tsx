import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from '../hooks/useOnboarding';
import { describe, test, expect } from 'vitest';

describe('Mentor Onboarding', () => {
  test('Wizard navigates through steps correctly', () => {
    const { result } = renderHook(() => useOnboarding());
    
    expect(result.current.currentStep).toBe('profile');
    
    act(() => {
      result.current.nextStep();
    });
    
    expect(result.current.currentStep).toBe('wallet');
    expect(result.current.completedSteps).toContain('profile');
  });

  test('Progress tracking calculates percentage correctly', () => {
    const { result } = renderHook(() => useOnboarding());
    
    act(() => {
      result.current.nextStep(); // to wallet
      result.current.nextStep(); // to availability
    });
    
    // (3 completed / 5 total steps) * 100 = 60%
    expect(result.current.progress).toBe(60);
  });
});
