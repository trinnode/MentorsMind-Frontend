import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import MentorDashboard from '../pages/MentorDashboard';
import { useMentorDashboard } from '../hooks/useMentorDashboard';
import { vi, describe, test, expect } from 'vitest';

describe('Mentor Dashboard', () => {
  test('MentorDashboard renders all major widgets', () => {
    render(<MentorDashboard />);
    
    expect(screen.getByText(/Upcoming Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Earnings/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/Activity Feed/i)).toBeInTheDocument();
  });

  test('Session confirmation updates status', () => {
    const { result } = renderHook(() => useMentorDashboard());
    
    act(() => {
      result.current.confirmSession('s1');
    });
    
    const session = result.current.data.upcomingSessions.find(s => s.id === 's1');
    expect(session?.status).toBe('confirmed');
  });

  test('Earnings export triggers correctly', () => {
    const { result } = renderHook(() => useMentorDashboard());
    const spy = vi.spyOn(document, 'createElement');
    
    act(() => {
      result.current.exportEarningsCSV();
    });
    
    expect(spy).toHaveBeenCalledWith('a');
  });

  test('Availability toggle updates UI', async () => {
    render(<MentorDashboard />);
    
    expect(screen.getByText(/Active Now/i)).toBeInTheDocument();
    const toggleButton = screen.getByTitle(/Toggle Availability/i);
    
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Active Now/i)).toBeInTheDocument();
  });
});
