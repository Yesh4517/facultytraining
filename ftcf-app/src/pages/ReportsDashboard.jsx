import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import Layout from '../components/Layout';
import {
  departmentStats, complianceData, categoryDistribution,
  creditTrendYearly, facultyList,
} from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'faculty', label: 'Faculty Report' },
    { id: 'trends', label: 'Trends' },
  ];

  const radarData = departmentStats.map((d) => ({
    subject: d.department.replace(' Engg', '').replace(' Administration', ' Admin'),
    credits: d.avgCredits,
    compliance: d.compliance,
  }));

  return (
    <Layout title="Reports Dashboard">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Analytics & Reports</h2>
          <p className="text-rose-100 text-sm">Academic Year 2026 · All Departments</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px border-b-2 ${
              activeTab === t.id
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" /> Credit Issuance 5-Year Trend
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={creditTrendYearly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="issued" name="Credits Issued" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={18} className="text-purple-500" /> Training Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="45%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                    {categoryDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-rose-500" /> Average Credits per Department
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentStats} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 60]} />
                <Tooltip />
                <Bar dataKey="avgCredits" name="Avg Credits" radius={[6, 6, 0, 0]}>
                  {departmentStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── COMPLIANCE TAB ── */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Compliance Breakdown by Department</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={complianceData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend iconType="circle" iconSize={10} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="behind" name="Behind" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Department Performance Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar name="Avg Credits" dataKey="credits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Compliance %" dataKey="compliance" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance table */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Compliance Rate Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="table-header">Department</th>
                    <th className="table-header">Faculty</th>
                    <th className="table-header">Avg Credits</th>
                    <th className="table-header">Compliance</th>
                    <th className="table-header">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((d) => (
                    <tr key={d.department} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="table-cell font-medium">{d.department}</td>
                      <td className="table-cell text-gray-500">{d.faculty}</td>
                      <td className="table-cell font-bold text-blue-700">{d.avgCredits}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${d.compliance >= 75 ? 'bg-emerald-500' : d.compliance >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${d.compliance}%` }} />
                          </div>
                          <span className="text-sm font-medium">{d.compliance}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={d.compliance >= 75 ? 'badge-green' : d.compliance >= 50 ? 'badge-yellow' : 'badge-red'}>
                          {d.compliance >= 75 ? 'Good' : d.compliance >= 50 ? 'Average' : 'Poor'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── FACULTY TAB ── */}
      {activeTab === 'faculty' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Individual Faculty Report
            </h3>
            <button className="btn-secondary flex items-center gap-2 text-sm py-1.5">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">#</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Designation</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Credits</th>
                  <th className="table-header">Progress</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((f, idx) => {
                  const pct = Math.min(Math.round((f.totalCredits / f.requiredCredits) * 100), 100);
                  return (
                    <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="table-cell text-gray-400">{idx + 1}</td>
                      <td className="table-cell font-medium">{f.name}</td>
                      <td className="table-cell text-gray-500">{f.department}</td>
                      <td className="table-cell text-gray-500">{f.designation}</td>
                      <td className="table-cell text-gray-500 text-xs">{f.email}</td>
                      <td className="table-cell font-bold text-blue-700">{f.totalCredits}/{f.requiredCredits}</td>
                      <td className="table-cell" style={{ minWidth: 120 }}>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={f.status === 'Completed' ? 'badge-green' : f.status === 'In Progress' ? 'badge-blue' : 'badge-red'}>
                          {f.status}
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

      {/* ── TRENDS TAB ── */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Year-over-Year Credit Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={creditTrendYearly} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="issued" name="Credits Issued" radius={[8, 8, 0, 0]}>
                  {creditTrendYearly.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'YoY Growth', value: '+10%', color: 'text-emerald-600' },
              { label: 'Peak Month', value: 'August', color: 'text-blue-600' },
              { label: 'Top Category', value: 'Technical', color: 'text-purple-600' },
              { label: 'Avg per Faculty', value: '29.3', color: 'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
