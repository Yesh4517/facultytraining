import { useState, useEffect } from 'react';
import { Award, Filter, Download, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { creditsApi, statsApi } from '../api';
import { useApp } from '../context/useApp';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const statusBadge = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
};

const typeColors = {
  Certification: 'badge-blue',
  'Training Programme': 'badge-green',
  Workshop: 'badge-yellow',
  Conference: 'bg-purple-100 text-purple-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
};

export default function CreditHistory() {
  const { currentUser } = useApp();
  const [history, setHistory]   = useState([]);
  const [trends, setTrends]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const periods = ['All', 'Fall 2026', 'Spring 2026', 'Summer 2026'];

  useEffect(() => {
    Promise.all([creditsApi.getAll(), statsApi.monthlyTrends()])
      .then(([h, t]) => { setHistory(h); setTrends(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const filtered = filter === 'All' ? history : history.filter((c) => c.period === filter);
  const totalApproved   = history.filter((c) => c.status === 'Approved').reduce((s, c) => s + c.credits, 0);
  const totalPending    = history.filter((c) => c.status === 'Pending').reduce((s, c) => s + c.credits, 0);
  const totalActivities = history.length;

  return (
    <Layout title="Credit History">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">My Credit History</h2>
        <p className="text-amber-100 text-sm">Track all your training activities and credit accumulation.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalApproved}</div>
          <p className="text-gray-500 text-sm">Approved Credits</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-amber-600 mb-1">{totalPending}</div>
          <p className="text-gray-500 text-sm">Pending Credits</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-700 mb-1">{totalActivities}</div>
          <p className="text-gray-500 text-sm">Total Activities</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" /> Monthly Credits Earned
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="credits" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={18} className="text-blue-500" /> Credits by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={(() => {
                  const catMap = {};
                  const catColors = { Technical: '#3b82f6', Teaching: '#10b981', Research: '#f59e0b', Leadership: '#8b5cf6' };
                  history.forEach((h) => { if (!catMap[h.category]) catMap[h.category] = 0; catMap[h.category] += h.credits; });
                  return Object.entries(catMap).map(([name, value]) => ({ name, value, color: catColors[name] || '#6b7280' }));
                })()}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {['#3b82f6','#10b981','#f59e0b','#8b5cf6'].map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} credits`, '']} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold text-gray-800">Activity Log</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === p ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="btn-secondary flex items-center gap-2 text-sm py-1.5">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Activity</th>
                <th className="table-header">Type</th>
                <th className="table-header">Category</th>
                <th className="table-header">Credits</th>
                <th className="table-header">Date</th>
                <th className="table-header">Period</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-medium max-w-xs">
                    <p className="truncate">{h.activity}</p>
                  </td>
                  <td className="table-cell"><span className={typeColors[h.type] || 'badge-blue'}>{h.type}</span></td>
                  <td className="table-cell text-gray-500">{h.category}</td>
                  <td className="table-cell">
                    <span className="font-bold text-blue-700">{h.credits}</span>
                  </td>
                  <td className="table-cell text-gray-500">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="table-cell text-gray-500">{h.period}</td>
                  <td className="table-cell"><span className={statusBadge[h.status]}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>No records found for the selected period.</p>
          </div>
        )}

        {/* Footer total */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
          <p className="text-sm font-semibold text-gray-700">
            Subtotal: <span className="text-blue-700">{filtered.reduce((s, h) => s + h.credits, 0)} credits</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
