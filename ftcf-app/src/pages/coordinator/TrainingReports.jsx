import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, Award, CalendarCheck } from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import {
  coordinatorReportStats, enrollmentByProgram, attendanceTrend,
  trainingPrograms, categoryDistribution, allRegistrations,
} from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function TrainingReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'enrollment',  label: 'Enrollment' },
    { id: 'attendance',  label: 'Attendance' },
    { id: 'programs',    label: 'Program Report' },
  ];

  // Registrations by status for pie
  const regStatusData = [
    { name: 'Approved', value: allRegistrations.filter(r => r.status === 'Approved').length, color: '#10b981' },
    { name: 'Pending',  value: allRegistrations.filter(r => r.status === 'Pending').length,  color: '#f59e0b' },
    { name: 'Rejected', value: allRegistrations.filter(r => r.status === 'Rejected').length, color: '#ef4444' },
  ];

  return (
    <Layout title="Training Reports">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Training Reports & Analytics</h2>
          <p className="text-rose-100 text-sm">Academic Year 2026 · Department View</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 transition px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatCard title="Programs Created"     value={coordinatorReportStats.totalProgramsCreated} subtitle="This year"            icon={BarChart3}    color="blue" />
        <StatCard title="Total Enrollments"    value={coordinatorReportStats.totalEnrollments}     subtitle="Across all programs"  icon={Users}        color="purple" />
        <StatCard title="Attendance Rate"      value={`${coordinatorReportStats.attendanceRate}%`} subtitle="Average this year"    icon={CalendarCheck} color="green" />
        <StatCard title="Certificates Issued"  value={coordinatorReportStats.certificatesIssued}   subtitle="Verified & approved"  icon={Award}        color="yellow" />
        <StatCard title="Avg Credits/Program"  value={coordinatorReportStats.avgCreditsPerProgram} subtitle="Per training program" icon={TrendingUp}   color="blue" />
        <StatCard title="Upcoming Programs"    value={coordinatorReportStats.upcomingPrograms}     subtitle="Scheduled this term"  icon={CalendarCheck} color="purple" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px border-b-2 ${
              activeTab === t.id
                ? 'border-rose-600 text-rose-700 bg-rose-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Enrollment vs Capacity by Program</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={enrollmentByProgram} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" iconSize={10} />
                <Bar dataKey="capacity" name="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enrolled" name="Enrolled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Registration Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={regStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {regStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── ENROLLMENT ── */}
      {activeTab === 'enrollment' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Enrollment Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={enrollmentByProgram} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="enrolled" name="Enrolled" radius={[6, 6, 0, 0]}>
                  {enrollmentByProgram.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Training Category Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}>
                  {categoryDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Attendance Rate (%)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Attendance']} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Best Month', value: 'October', sub: '88% rate', color: 'text-emerald-600' },
              { label: 'Lowest Month', value: 'July', sub: '72% rate', color: 'text-red-500' },
              { label: 'Average Rate', value: '80.8%', sub: 'Last 6 months', color: 'text-blue-600' },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROGRAM REPORT ── */}
      {activeTab === 'programs' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Program Performance Summary</h3>
            <button className="btn-secondary flex items-center gap-2 text-sm py-1.5">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">Program</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Mode</th>
                  <th className="table-header">Credits</th>
                  <th className="table-header">Enrolled</th>
                  <th className="table-header">Fill Rate</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {trainingPrograms.map((p) => {
                  const pct = Math.round((p.enrolled / p.seats) * 100);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="table-cell">
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.provider}</p>
                      </td>
                      <td className="table-cell text-gray-500">{p.category}</td>
                      <td className="table-cell text-gray-500">{p.mode}</td>
                      <td className="table-cell font-bold text-blue-700">{p.credits}</td>
                      <td className="table-cell">{p.enrolled}/{p.seats}</td>
                      <td className="table-cell" style={{ minWidth: 130 }}>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={p.status === 'Published' ? 'badge-green' : p.status === 'Draft' ? 'badge-yellow' : 'badge-red'}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
