import { Link } from 'react-router-dom';
import {
  Users, ShieldCheck, CheckCircle, Clock, ArrowRight,
  CalendarCheck, PlusCircle, ListChecks, TrendingUp, BookOpen,
} from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import {
  facultyList, certificates, trainingPrograms,
  allRegistrations, coordinatorReportStats, enrollmentByProgram,
} from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../../context/useApp';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const statusStyle = {
  Completed: 'badge-green',
  'In Progress': 'badge-blue',
  Behind: 'badge-red',
};

const programStatusBadge = {
  Published: 'badge-green',
  Draft: 'badge-yellow',
  Full: 'badge-red',
};

export default function CoordinatorDashboard() {
  const { currentUser } = useApp();
  const pendingCerts = certificates.filter((c) => c.status === 'Pending');
  const pendingRegs = allRegistrations.filter((r) => r.status === 'Pending');
  const completedFaculty = facultyList.filter((f) => f.status === 'Completed').length;
  const publishedPrograms = trainingPrograms.filter((t) => t.status === 'Published').length;

  const recentPrograms = trainingPrograms.slice(0, 4);

  return (
    <Layout title="Coordinator Dashboard">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <p className="text-teal-100 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-teal-200 text-sm mt-1">{currentUser?.designation} · {currentUser?.department}</p>
        </div>
        <Link to="/coordinator/create"
          className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2.5 rounded-xl text-sm font-semibold">
          <PlusCircle size={18} /> New Program
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Programs" value={publishedPrograms} subtitle="Currently published" icon={BookOpen} color="blue" />
        <StatCard title="Pending Registrations" value={pendingRegs.length} subtitle="Awaiting approval" icon={Clock} color="yellow" />
        <StatCard title="Pending Certificates" value={pendingCerts.length} subtitle="Awaiting verification" icon={ShieldCheck} color="purple" />
        <StatCard title="Faculty on Track" value={completedFaculty} subtitle="Completed annual target" icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Enrollment chart */}
        <div className="card xl:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-500" /> Enrollment vs Capacity
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={enrollmentByProgram} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="capacity" name="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="enrolled" name="Enrolled" radius={[4, 4, 0, 0]}>
                {enrollmentByProgram.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: '/coordinator/create', label: 'Create New Program', icon: PlusCircle, color: 'bg-blue-50 text-blue-600' },
              { to: '/coordinator/registrations', label: 'Review Registrations', icon: ListChecks, color: 'bg-amber-50 text-amber-600' },
              { to: '/coordinator/attendance', label: 'Record Attendance', icon: CalendarCheck, color: 'bg-purple-50 text-purple-600' },
              { to: '/verify', label: 'Verify Certificates', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-600' },
              { to: '/coordinator/reports', label: 'View Reports', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group">
                <div className={`p-2 rounded-lg ${color}`}><Icon size={16} /></div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Recent programs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Programs</h3>
            <Link to="/coordinator/programs" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Manage all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPrograms.map((p) => {
              const pct = Math.round((p.enrolled / p.seats) * 100);
              return (
                <div key={p.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{p.title}</p>
                    <span className={programStatusBadge[p.status]}>{p.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{p.provider} · {p.mode} · {p.credits} credits</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{p.enrolled}/{p.seats}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending registrations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Pending Registrations</h3>
            <Link to="/coordinator/registrations" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingRegs.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.facultyName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{r.trainingTitle}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-200 transition">
                    Approve
                  </button>
                  <button className="text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-200 transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingRegs.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No pending registrations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faculty progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Faculty Credit Progress</h3>
          <span className="text-xs text-gray-400">{facultyList.length} members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Name</th>
                <th className="table-header">Department</th>
                <th className="table-header">Credits</th>
                <th className="table-header">Progress</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map((f) => {
                const pct = Math.min(Math.round((f.totalCredits / f.requiredCredits) * 100), 100);
                return (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="table-cell font-medium">{f.name}</td>
                    <td className="table-cell text-gray-500">{f.department}</td>
                    <td className="table-cell">
                      <span className="font-bold text-blue-700">{f.totalCredits}</span>
                      <span className="text-gray-400 text-xs">/{f.requiredCredits}</span>
                    </td>
                    <td className="table-cell" style={{ minWidth: 130 }}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={statusStyle[f.status]}>{f.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
