import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, Clock, CheckCircle, TrendingUp,
  Upload, ClipboardList, ArrowRight, Star, AlertCircle,
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useApp } from '../context/useApp';
import { registrationsApi, creditsApi, statsApi } from '../api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const statusColor = {
  Approved:  'badge-green',
  Pending:   'badge-yellow',
  Completed: 'badge-green',
  Rejected:  'badge-red',
};

export default function FacultyDashboard() {
  const { currentUser } = useApp();
  const [regs, setRegs]           = useState([]);
  const [history, setHistory]     = useState([]);
  const [trends, setTrends]       = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    Promise.all([
      registrationsApi.getAll(),
      creditsApi.getAll(),
      statsApi.monthlyTrends(),
      statsApi.faculty('me'),
    ])
      .then(([r, h, t, s]) => {
        setRegs(r);
        setHistory(h);
        setTrends(t);
        setStats(s);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const earned   = currentUser?.totalCredits   || 0;
  const required = currentUser?.requiredCredits || 40;
  const pct      = Math.min(Math.round((earned / required) * 100), 100);

  const approvedCount = history.filter((h) => h.status === 'Approved').length;
  const pendingCount  = history.filter((h) => h.status === 'Pending').length;
  const recentActivity = history.slice(0, 4);

  if (loading) {
    return (
      <Layout title="Faculty Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Faculty Dashboard">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-blue-200 text-sm mt-1">{currentUser?.designation} · {currentUser?.department}</p>
        </div>
        <div className="hidden md:flex flex-col items-center bg-white/10 rounded-xl px-6 py-4">
          <Star className="text-yellow-300 mb-1" size={24} />
          <p className="text-2xl font-bold">{earned}</p>
          <p className="text-blue-200 text-xs">Credits Earned</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Credits"  value={earned}         subtitle={`of ${required} required`}  icon={Award}         color="blue"   trend={12} />
        <StatCard title="Registered"     value={regs.length}    subtitle="Active registrations"        icon={ClipboardList} color="purple" />
        <StatCard title="Completed"      value={approvedCount}  subtitle="Verified trainings"          icon={CheckCircle}   color="green"  />
        <StatCard title="Pending"        value={pendingCount}   subtitle="Awaiting approval"           icon={Clock}         color="yellow" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Credit progress */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Annual Credit Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-bold text-blue-700">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{earned}</p>
              <p className="text-gray-400 text-xs">Earned</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{Math.max(required - earned, 0)}</p>
              <p className="text-gray-400 text-xs">Remaining</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{required}</p>
              <p className="text-gray-400 text-xs">Required</p>
            </div>
          </div>
          {pct >= 100 && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <p className="text-emerald-700 text-sm font-semibold">🎉 Annual target achieved!</p>
            </div>
          )}
        </div>

        {/* Monthly trend chart */}
        <div className="card xl:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> Monthly Credit Trend
          </h3>
          {trends.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No trend data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="credits" stroke="#3b82f6" fill="url(#creditGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">My Registrations</h3>
            <Link to="/register" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              New <ArrowRight size={14} />
            </Link>
          </div>
          {regs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No registrations yet.</p>
          ) : (
            <div className="space-y-3">
              {regs.slice(0, 4).map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{r.training?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.registrationDate).toLocaleDateString()}</p>
                  </div>
                  <span className={statusColor[r.status] || 'badge-blue'}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent credit activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <Link to="/credits" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Full history <ArrowRight size={14} />
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((h) => (
                <div key={h._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                    h.category === 'Technical'  ? 'bg-blue-100 text-blue-700'   :
                    h.category === 'Teaching'   ? 'bg-green-100 text-green-700' :
                    h.category === 'Research'   ? 'bg-amber-100 text-amber-700' :
                                                   'bg-purple-100 text-purple-700'
                  }`}>
                    {h.credits}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{h.activity}</p>
                    <p className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString()} · {h.category}</p>
                  </div>
                  <span className={statusColor[h.status] || 'badge-blue'}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link to="/browse" className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
          <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
            <BookOpen className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Browse Trainings</p>
            <p className="text-xs text-gray-400">Explore available programmes</p>
          </div>
        </Link>
        <Link to="/register" className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
          <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
            <ClipboardList className="text-purple-600" size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Register Training</p>
            <p className="text-xs text-gray-400">Enrol in a programme</p>
          </div>
        </Link>
        <Link to="/upload" className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
          <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors">
            <Upload className="text-emerald-600" size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Upload Certificate</p>
            <p className="text-xs text-gray-400">Submit for credit approval</p>
          </div>
        </Link>
      </div>
    </Layout>
  );
}
