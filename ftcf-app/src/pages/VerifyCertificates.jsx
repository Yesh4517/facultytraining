import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, X, Eye, AlertCircle, Search } from 'lucide-react';
import Layout from '../components/Layout';
import { certificatesApi } from '../api';
import { useApp } from '../context/useApp';

const statusBadge = {
  Verified: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
};

export default function VerifyCertificates() {
  const { currentUser } = useApp();
  const [certs, setCerts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [selected, setSelected]     = useState(null);
  const [rejectReason, setRejectReason]     = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading]   = useState(false);
  const [actionError, setActionError]       = useState('');

  const filters = ['All', 'Pending', 'Verified', 'Rejected'];

  useEffect(() => {
    setLoading(true);
    certificatesApi.getAll()
      .then(setCerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = certs.filter((c) => {
    const name = c.faculty?.name || '';
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      c.trainingTitle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleVerify = async (id) => {
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await certificatesApi.verify(id, { action: 'approve' });
      setCerts((prev) => prev.map((c) => (c._id === id ? updated : c)));
      setSelected(updated);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await certificatesApi.verify(id, { action: 'reject', rejectionReason: rejectReason });
      setCerts((prev) => prev.map((c) => (c._id === id ? updated : c)));
      setSelected(updated);
      setShowRejectModal(false);
      setRejectReason('');
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = certs.filter((c) => c.status === 'Pending').length;

  if (loading) return (
    <Layout title="Verify Certificates">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  return (
    <Layout title="Verify Certificates">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Certificate Verification</h2>
        <p className="text-violet-100 text-sm">{pendingCount} certificate{pendingCount !== 1 ? 's' : ''} awaiting review</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search by faculty or training…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <div className="xl:col-span-2 card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">Faculty</th>
                  <th className="table-header">Training</th>
                  <th className="table-header">Credits</th>
                  <th className="table-header">Uploaded</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${selected?._id === c._id ? 'bg-blue-50' : ''}`}
                    onClick={() => { setSelected(c); setActionError(''); }}>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{c.faculty?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{c.faculty?.department || ''}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm max-w-[160px] truncate">{c.trainingTitle}</p>
                      <p className="text-xs text-gray-400">{c.provider}</p>
                    </td>
                    <td className="table-cell font-bold text-blue-700">{c.credits}</td>
                    <td className="table-cell text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell"><span className={statusBadge[c.status]}>{c.status}</span></td>
                    <td className="table-cell">
                      <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <ShieldCheck size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No certificates match this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="card">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Certificate Detail</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              {actionError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 mb-3 text-xs">
                  <AlertCircle size={12} /> {actionError}
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3 text-sm">
                <div><p className="text-xs text-gray-400">Faculty</p><p className="font-medium">{selected.faculty?.name || '—'}</p></div>
                <div><p className="text-xs text-gray-400">Department</p><p className="font-medium">{selected.faculty?.department || '—'}</p></div>
                <div><p className="text-xs text-gray-400">Training</p><p className="font-medium">{selected.trainingTitle}</p></div>
                <div><p className="text-xs text-gray-400">Provider</p><p className="font-medium">{selected.provider}</p></div>
                <div><p className="text-xs text-gray-400">Completion Date</p><p className="font-medium">{new Date(selected.completionDate).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-gray-400">Credits Claimed</p><p className="font-bold text-blue-700 text-lg">{selected.credits}</p></div>
                <div><p className="text-xs text-gray-400">Category</p><p className="font-medium">{selected.category}</p></div>
                {selected.fileName && (
                  <div><p className="text-xs text-gray-400">File</p>
                    <a href={`http://localhost:5000${selected.filePath}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                      <Eye size={12} /> {selected.fileName}
                    </a>
                  </div>
                )}
                {selected.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-500 font-semibold mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-700">{selected.rejectionReason}</p>
                  </div>
                )}
              </div>

              {selected.status === 'Pending' && (
                <div className="space-y-3">
                  <button onClick={() => handleVerify(selected._id)} disabled={actionLoading}
                    className={`btn-success w-full flex items-center justify-center gap-2 ${actionLoading ? 'opacity-60' : ''}`}>
                    {actionLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={16} />}
                    Approve & Grant Credits
                  </button>
                  <button onClick={() => setShowRejectModal(true)} disabled={actionLoading}
                    className={`btn-danger w-full flex items-center justify-center gap-2 ${actionLoading ? 'opacity-60' : ''}`}>
                    <X size={16} /> Reject Certificate
                  </button>
                </div>
              )}
              {selected.status !== 'Pending' && (
                <div className={`rounded-lg p-3 text-center text-sm font-medium ${selected.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {selected.status === 'Verified' ? '✓ Verified & Credits Granted' : '✗ Certificate Rejected'}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Eye size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a row to view certificate details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg"><AlertCircle className="text-red-600" size={20} /></div>
              <h3 className="font-bold text-gray-800">Reject Certificate</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection. This will be visible to the faculty member.</p>
            <textarea
              className="input resize-none mb-4"
              rows={4}
              placeholder="e.g. Certificate not from an accredited provider…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => handleReject(selected?._id)} disabled={!rejectReason.trim() || actionLoading}
                className={`btn-danger flex-1 ${(!rejectReason.trim() || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {actionLoading ? 'Rejecting…' : 'Confirm Rejection'}
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
