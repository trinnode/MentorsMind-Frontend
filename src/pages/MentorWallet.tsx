import MetricCard from '../components/charts/MetricCard';
import PaymentHistory from './PaymentHistory';

export default function MentorWallet() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Available Balance" value="1,240.00" prefix="$" icon="💰" />
        <MetricCard title="In Escrow" value="360.00" prefix="$" icon="🔒" />
        <MetricCard title="Total Earned" value="8,420.00" prefix="$" icon="📈" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-900">Stellar Wallet</h2>
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-xs text-gray-500">Public Key</p>
            <p className="text-xs font-mono text-gray-700">GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </div>
        </div>
        <button className="text-sm text-indigo-600 hover:underline">Connect Freighter Wallet</button>
      </div>
      <PaymentHistory />
    </div>
  );
}
