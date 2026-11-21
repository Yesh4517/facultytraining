import { Link } from 'react-router-dom';
import {
  Users, BookOpen, ShieldCheck, TrendingUp,
  Award, Building2, ArrowRight, AlertTriangle,
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import {
  systemStats, facultyList, departmentStats,
  categoryDistribution, creditTrendYearly,
} from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">System Administration</h2>
        <p className="text-slate-300 text-sm">
          Faculty Training Credit Framework — October 2026
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Faculty" value={systemStats.totalFaculty} subtitle="Across all departments" icon={Users} color="blue" trend={5} />
        <StatCard title="Active Trainings" value={systemStats.activeTrainings} subtitle="Programmes running now" icon={BookOpen} color="green" />
        <StatCard title="Pending Certificates" value={systemStats.certificatesPending} subtitle="Awaiting verification" icon={ShieldCheck} color="yellow" />
        <StatCard title="Overall Compliance" value={`${systemStats.overallCompliance}%`} subtitle="Faculty meeting target" icon={TrendingUp} color="purple" />
        <StatCard title="Credits Issued" value={systemStats.creditsIssuedThisYear.toLocaleString()} subtitle="This academic year" icon={Award} color="blue" trend={9} />
        <StatCard title="Departments" value={systemStats.totalDepartments} subtitle="Active departments" icon={Building2} color="green" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Yearly trend */}
        <div className="card xl:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> Credits Issued — 5-Year Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={creditTrendYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Credits by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept stats + at-risk faculty */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Department avg credits */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Average Credits by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentStats} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 50]} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="avgCredits" name="Avg Credits" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At-risk faculty */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Faculty Behind Target
            </h3>
            <Link to="/reports" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Full report <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {facultyList
              .filter((f) => f.status === 'Behind')
              .map((f) => {
                const pct = Math.round((f.totalCredits / f.requiredCredits) * 100);
                return (
                  <div key={f.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">
                      {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                      <p className="text-xs text-gray-500">{f.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-red-100 rounded-full h-1">
                          <div className="bg-red-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-red-600 font-medium">{pct}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-600">{f.totalCredits}/{f.requiredCredits}</span>
                  </div>
                );
              })}
            {facultyList.filter((f) => f.status === 'Behind').length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">All faculty on track!</p>
            )}
          </div>
        </div>
      </div>

      {/* Department compliance table */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Department Compliance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Department</th>
                <th className="table-header">Total Faculty</th>
                <th className="table-header">Avg Credits</th>
                <th className="table-header">Compliance %</th>
                <th className="table-header">Progress</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((d) => (
                <tr key={d.department} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-medium">{d.department}</td>
                  <td className="table-cell text-gray-500">{d.faculty}</td>
                  <td className="table-cell font-bold text-blue-700">{d.avgCredits}</td>
                  <td className="table-cell">
                    <span className={`font-semibold ${d.compliance >= 75 ? 'text-emerald-600' : d.compliance >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {d.compliance}%
                    </span>
                  </td>
                  <td className="table-cell" style={{ minWidth: 140 }}>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${d.compliance >= 75 ? 'bg-emerald-500' : d.compliance >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${d.compliance}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
