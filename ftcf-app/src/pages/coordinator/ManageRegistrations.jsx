import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, X, Clock, Download } from 'lucide-react';
import Layout from '../../components/Layout';
import { registrationsApi, trainingsApi } from '../../api';

const statusBadge = {
  Approved: 'badge-green',
  Pending:  'badge-yellow',
  Rejected: 'badge-red',
};

export default function ManageRegistrations() {
  const [regs, setRegs]           = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [program, setProgram]     = useState('All');

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    Promise.all([registrationsApi.getAll(), trainingsApi.getAll()])
      .then(([r, t]) => { setRegs(r); setTrainings(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = regs.filter((r) => {
    const facultyName  = r.faculty?.name || '';
    const trainingTitle = r.training?.title || '';
    const matchSearch  = facultyName.toLowerCase().includes(search.toLowerCase()) ||
                         trainingTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = filter  === 'All' || r.status === filter;
    const matchProgram = program === 'All' || r.training?._id === program;
    return matchSearch && matchStatus && matchProgram;
  });

  const updateStatus = async (id, status) => {
    try {
      const updated = await registrationsApi.updateStatus(id, { status });
      setRegs((prev) => prev.map((r) => (r._id === id ? { ...r, status: updated.status } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount  = regs.filter((r) => r.status === 'Pending').length;
  const approvedCount = regs.filter((r) => r.status === 'Approved').length;
  const rejectedCount = regs.filter((r) => r.status === 'Rejected').length;

  return (
    <Layout title="Manage Registrations">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Faculty Registrations</h2>
        <p className="text-violet-100 text-sm">Review and approve faculty registration requests.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (<>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-emerald-600">{approvedCount}</div>
          <p className="text-sm text-gray-500 mt-1">Approved</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
          <p className="text-sm text-gray-500 mt-1">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search faculty or training…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-400" />
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <select className="input w-auto min-w-[200px]" value={program} onChange={(e) => setProgram(e.target.value)}>
            <option value="All">All Programs</option>
            {trainings.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Download size={14} /> Export
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Faculty Member</th>
                <th className="table-header">Training Program</th>
                <th className="table-header">Credits</th>
                <th className="table-header">Date Applied</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{r.faculty?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{r.faculty?.department || ''}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="text-sm max-w-[200px] truncate text-gray-700">{r.training?.title || '—'}</p>
                  </td>
                  <td className="table-cell font-bold text-blue-700">{r.credits}</td>
                  <td className="table-cell text-gray-500">{new Date(r.registrationDate).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <span className={statusBadge[r.status]}>{r.status}</span>
                  </td>
                  <td className="table-cell">
                    {r.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(r._id, 'Approved')}
                          className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-emerald-200 transition">
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(r._id, 'Rejected')}
                          className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-200 transition">
                          <X size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Clock size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No registrations match this filter.</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <span>{filtered.length} records shown</span>
          <span>Total pending: <span className="font-semibold text-amber-600">{pendingCount}</span></span>
        </div>
      </div>
      </>)}
    </Layout>
  );
}
