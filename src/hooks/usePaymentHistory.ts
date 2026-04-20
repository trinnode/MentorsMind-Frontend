import { useState, useMemo, useCallback } from 'react';
import type { PaymentTransaction, PaymentStatus, PaymentAnalytics } from '../types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx1',
    type: 'session',
    mentorId: 'm1',
    mentorName: 'Dr. Sarah Chen',
    amount: 75,
    currency: 'XLM',
    status: 'completed',
    date: '2026-03-20T10:30:00Z',
    stellarTxHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    description: 'Session: Soroban Smart Contracts Deep Dive',
    sessionId: 's1',
    sessionTopic: 'Soroban Smart Contracts Deep Dive',
  },
  {
    id: 'tx2',
    type: 'session',
    mentorId: 'm2',
    mentorName: 'Alex Rivera',
    amount: 50,
    currency: 'XLM',
    status: 'completed',
    date: '2026-03-18T14:00:00Z',
    stellarTxHash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    description: 'Session: Stellar Wallet Integration Basics',
    sessionId: 's2',
    sessionTopic: 'Stellar Wallet Integration Basics',
  },
  {
    id: 'tx3',
    type: 'session',
    mentorId: 'm3',
    mentorName: 'Nina Okafor',
    amount: 100,
    currency: 'XLM',
    status: 'pending',
    date: '2026-03-22T09:00:00Z',
    stellarTxHash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    description: 'Session: DeFi Protocol Architecture on Stellar',
    sessionId: 's3',
    sessionTopic: 'DeFi Protocol Architecture on Stellar',
  },
  {
    id: 'tx4',
    type: 'session',
    mentorId: 'm1',
    mentorName: 'Dr. Sarah Chen',
    amount: 75,
    currency: 'XLM',
    status: 'failed',
    date: '2026-03-15T11:00:00Z',
    stellarTxHash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    description: 'Session: JavaScript SDK for Stellar — payment failed',
    sessionId: 's4',
    sessionTopic: 'JavaScript SDK for Stellar',
  },
  {
    id: 'tx5',
    type: 'refund',
    mentorId: 'm2',
    mentorName: 'Alex Rivera',
    amount: 50,
    currency: 'XLM',
    status: 'refunded',
    date: '2026-03-12T16:45:00Z',
    stellarTxHash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    description: 'Refund: Cancelled session - Stellar Wallet Integration',
    sessionId: 's5',
    sessionTopic: 'Stellar Wallet Integration',
  },
  {
    id: 'tx6',
    type: 'session',
    mentorId: 'm4',
    mentorName: 'Kwame Mensah',
    amount: 120,
    currency: 'XLM',
    status: 'completed',
    date: '2026-03-10T13:30:00Z',
    stellarTxHash: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1',
    description: 'Session: Advanced Anchor Protocols',
    sessionId: 's6',
    sessionTopic: 'Advanced Anchor Protocols',
  },
  {
    id: 'tx7',
    type: 'session',
    mentorId: 'm5',
    mentorName: 'Priya Sharma',
    amount: 60,
    currency: 'XLM',
    status: 'completed',
    date: '2026-03-08T10:00:00Z',
    stellarTxHash: 'a7b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b7',
    description: 'Session: Soroban Token Standards',
    sessionId: 's7',
    sessionTopic: 'Soroban Token Standards',
  },
  {
    id: 'tx8',
    type: 'session',
    mentorId: 'm3',
    mentorName: 'Nina Okafor',
    amount: 90,
    currency: 'XLM',
    status: 'pending',
    date: '2026-03-23T08:00:00Z',
    stellarTxHash: 'b8c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c8',
    description: 'Session: Cross-border Payment Systems',
    sessionId: 's8',
    sessionTopic: 'Cross-border Payment Systems',
  },
  {
    id: 'tx9',
    type: 'session',
    mentorId: 'm4',
    mentorName: 'Kwame Mensah',
    amount: 110,
    currency: 'XLM',
    status: 'completed',
    date: '2026-03-05T15:00:00Z',
    stellarTxHash: 'c9d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d9',
    description: 'Session: Liquidity Pool Design',
    sessionId: 's9',
    sessionTopic: 'Liquidity Pool Design',
  },
  {
    id: 'tx10',
    type: 'session',
    mentorId: 'm5',
    mentorName: 'Priya Sharma',
    amount: 65,
    currency: 'XLM',
    status: 'failed',
    date: '2026-03-01T12:00:00Z',
    stellarTxHash: 'd0e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e0',
    description: 'Session: Horizon API Workshop — payment failed',
    sessionId: 's10',
    sessionTopic: 'Horizon API Workshop',
  },
  {
    id: 'tx11',
    type: 'session',
    mentorId: 'm1',
    mentorName: 'Dr. Sarah Chen',
    amount: 80,
    currency: 'XLM',
    status: 'completed',
    date: '2026-02-25T09:30:00Z',
    stellarTxHash: 'e1f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f1',
    description: 'Session: Stellar Account Management',
    sessionId: 's11',
    sessionTopic: 'Stellar Account Management',
  },
  {
    id: 'tx12',
    type: 'refund',
    mentorId: 'm4',
    mentorName: 'Kwame Mensah',
    amount: 120,
    currency: 'XLM',
    status: 'refunded',
    date: '2026-02-20T17:00:00Z',
    stellarTxHash: 'f2a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a2',
    description: 'Refund: Mentor unavailable — Anchor Protocols',
    sessionId: 's12',
    sessionTopic: 'Advanced Anchor Protocols',
  },
  {
    id: 'tx13',
    type: 'session',
    mentorId: 'm2',
    mentorName: 'Alex Rivera',
    amount: 55,
    currency: 'XLM',
    status: 'completed',
    date: '2026-02-15T11:00:00Z',
    stellarTxHash: 'a3b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b3',
    description: 'Session: Path Payment Transactions',
    sessionId: 's13',
    sessionTopic: 'Path Payment Transactions',
  },
  {
    id: 'tx14',
    type: 'session',
    mentorId: 'm5',
    mentorName: 'Priya Sharma',
    amount: 70,
    currency: 'XLM',
    status: 'pending',
    date: '2026-03-23T16:00:00Z',
    stellarTxHash: 'b4c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c4',
    description: 'Session: Claimable Balances in Stellar',
    sessionId: 's14',
    sessionTopic: 'Claimable Balances in Stellar',
  },
  {
    id: 'tx15',
    type: 'session',
    mentorId: 'm3',
    mentorName: 'Nina Okafor',
    amount: 95,
    currency: 'XLM',
    status: 'completed',
    date: '2026-02-10T14:00:00Z',
    stellarTxHash: 'c5d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d5',
    description: 'Session: Stellar Consensus Protocol Deep Dive',
    sessionId: 's15',
    sessionTopic: 'Stellar Consensus Protocol Deep Dive',
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentFiltersState {
  dateFrom: string;
  dateTo: string;
  statuses: PaymentStatus[];
  search: string;
}

export type SortField = 'date' | 'amount' | 'status';
export type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const usePaymentHistory = () => {
  const [filters, setFilters] = useState<PaymentFiltersState>({
    dateFrom: '',
    dateTo: '',
    statuses: [],
    search: '',
  });

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Analytics (over full dataset) ──────────────────────────────────────────
  const analytics: PaymentAnalytics = useMemo(() => {
    return MOCK_TRANSACTIONS.reduce<PaymentAnalytics>(
      (acc, tx) => {
        acc.transactionCount += 1;
        if (tx.status === 'completed') {
          acc.totalCompleted += tx.amount;
          acc.totalSpent += tx.amount;
        } else if (tx.status === 'pending') {
          acc.totalPending += tx.amount;
          acc.totalSpent += tx.amount;
        } else if (tx.status === 'refunded') {
          acc.totalRefunded += tx.amount;
        } else if (tx.status === 'failed') {
          acc.totalFailed += tx.amount;
        }
        return acc;
      },
      { totalSpent: 0, totalCompleted: 0, totalPending: 0, totalRefunded: 0, totalFailed: 0, transactionCount: 0 }
    );
  }, []);

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    let result = [...MOCK_TRANSACTIONS];

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter(tx => tx.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      // Include the full day of dateTo
      result = result.filter(tx => tx.date <= filters.dateTo + 'T23:59:59Z');
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter(tx => filters.statuses.includes(tx.status));
    }

    // Search filter (mentor name or tx hash)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        tx =>
          tx.mentorName.toLowerCase().includes(q) ||
          tx.stellarTxHash.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = a.date.localeCompare(b.date);
      } else if (sortField === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [filters, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const pagedTransactions = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  const updateFilters = useCallback((patch: Partial<PaymentFiltersState>) => {
    setFilters(prev => ({ ...prev, ...patch }));
    setCurrentPage(1);
  }, []);

  const toggleStatusFilter = useCallback((status: PaymentStatus) => {
    setFilters(prev => {
      const exists = prev.statuses.includes(status);
      return {
        ...prev,
        statuses: exists
          ? prev.statuses.filter(s => s !== status)
          : [...prev.statuses, status],
      };
    });
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ dateFrom: '', dateTo: '', statuses: [], search: '' });
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortDirection('desc');
      return field;
    });
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ['Date', 'Mentor', 'Description', 'Amount (XLM)', 'Status', 'TX Hash'];
    const rows = filteredAndSorted.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      tx.mentorName,
      `"${tx.description}"`,
      tx.amount.toString(),
      tx.status,
      tx.stellarTxHash,
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredAndSorted]);

  const generateReceipt = useCallback((txId: string) => {
    const tx = MOCK_TRANSACTIONS.find(t => t.id === txId);
    if (!tx) return;

    const lines = [
      '╔══════════════════════════════════════════╗',
      '║         MENTORSMIND PAYMENT RECEIPT        ║',
      '╚══════════════════════════════════════════╝',
      '',
      `Receipt ID   : ${tx.id.toUpperCase()}`,
      `Date         : ${new Date(tx.date).toLocaleString()}`,
      `Mentor       : ${tx.mentorName}`,
      `Description  : ${tx.description}`,
      `Amount       : ${tx.amount} ${tx.currency}`,
      `Status       : ${tx.status.toUpperCase()}`,
      '',
      '── Stellar Transaction ─────────────────────',
      `TX Hash      : ${tx.stellarTxHash}`,
      `Explorer     : https://stellar.expert/explorer/testnet/tx/${tx.stellarTxHash}`,
      '',
      '────────────────────────────────────────────',
      `Generated    : ${new Date().toLocaleString()}`,
      '© MentorsMind — Powered by Stellar Network',
    ];

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `receipt_${tx.id}_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    transactions: pagedTransactions,
    allFilteredTransactions: filteredAndSorted,
    analytics,
    filters,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    totalResults: filteredAndSorted.length,
    updateFilters,
    toggleStatusFilter,
    clearFilters,
    handleSort,
    exportCSV,
    generateReceipt,
    setCurrentPage,
  };
};
