import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle, Search, Edit2, Trash2, Eye, Users,
  Calendar, Award, MoreVertical, Filter,
} from 'lucide-react';
import Layout from '../../components/Layout';
import { trainingsApi } from '../../api';

const statusBadge = {
  Published: 'badge-green',
  Draft:     'badge-yellow',
  Full:      'badge-red',
  Closed:    'bg-gray-100 text-gray-500 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
};

const categoryColor = {
  Technical:               'badge-blue',
  Teaching:                'badge-green',
  Research:                'badge-yellow',
  Leadership:              'bg-purple-100 text-purple-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  'Professional Development': 'bg-cyan-100 text-cyan-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
};

const modeColor = {
  Online:     'text-blue-600',
  'On-Campus':'text-emerald-600',
  Hybrid:     'text-purple-600',
};

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [view, setView]         = useState('grid');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const statuses = ['All', 'Open', 'Full', 'Draft'];

  useEffect(() => {
    trainingsApi.getAll()
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.provider.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id) => {
    try {
      await trainingsApi.delete(id);
      setPrograms((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
    setConfirmDelete(null);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Draft' : 'Open';
    try {
      const updated = await trainingsApi.update(id, { status: newStatus });
      setPrograms((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error(err);
    }
    setOpenMenu(null);
  };

  return (
    <Layout title="Manage Training Programs">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Training Programs</h2>
          <p className="text-indigo-100 text-sm">{programs.length} programs · {programs.filter(p => p.status === 'Open').length} open</p>
        </div>
        <Link to="/coordinator/create"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2.5 rounded-xl text-sm font-semibold">
          <PlusCircle size={18} /> New Program
        </Link>
      </div>

      {/* Filter bar */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search by title or provider…" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <button onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              Grid
            </button>
            <button onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${view === 'table' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              Table
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* ── Grid view ── */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => {
            return (
              <div key={p._id} className="card hover:shadow-lg transition-shadow flex flex-col relative">
                {/* Top bar */}
                <div className="flex items-start justify-between mb-3">
                  <span className={categoryColor[p.category] || 'badge-blue'}>{p.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={statusBadge[p.status]}>{p.status}</span>
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === p._id ? null : p._id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400">
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === p._id && (
                        <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-1 w-44">
                          <button onClick={() => { toggleStatus(p._id, p.status); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                            {p.status === 'Open' ? 'Close (Draft)' : 'Publish'}
                          </button>
                          <button onClick={() => { setConfirmDelete(p._id); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-base mb-1 leading-snug">{p.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{p.provider}</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">{p.description}</p>

                <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5"><Award size={12} className="text-blue-500" />{p.credits} Credits</div>
                  <div className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-500" />{new Date(p.startDate).toLocaleDateString()}</div>
                  <div className={`flex items-center gap-1.5 font-medium ${modeColor[p.mode]}`}>
                    ● {p.mode}
                  </div>
                  <div className="flex items-center gap-1.5"><Users size={12} className="text-emerald-500" />{p.enrolled}/{p.seats}</div>
                </div>

                {/* Enrollment bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Enrollment</span><span>{Math.round((p.enrolled / p.seats) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${(p.enrolled/p.seats) >= 0.9 ? 'bg-red-500' : (p.enrolled/p.seats) >= 0.6 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.round((p.enrolled / p.seats) * 100)}%` }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-sm transition">
                    <Eye size={14} /> View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 btn-primary py-2 text-sm">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table view ── */}
      {view === 'table' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">Title</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Mode</th>
                  <th className="table-header">Credits</th>
                  <th className="table-header">Enrollment</th>
                  <th className="table-header">Start Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.provider}</p>
                      </div>
                    </td>
                    <td className="table-cell"><span className={categoryColor[p.category] || 'badge-blue'}>{p.category}</span></td>
                    <td className="table-cell"><span className={`font-medium text-sm ${modeColor[p.mode]}`}>{p.mode}</span></td>
                    <td className="table-cell font-bold text-blue-700">{p.credits}</td>
                    <td className="table-cell">
                      <span className="text-sm">{p.enrolled}<span className="text-gray-400">/{p.seats}</span></span>
                    </td>
                    <td className="table-cell text-gray-500">{new Date(p.startDate).toLocaleDateString()}</td>
                    <td className="table-cell"><span className={statusBadge[p.status]}>{p.status}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                        <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"><Edit2 size={15} /></button>
                        <button onClick={() => setConfirmDelete(p._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No programs match.</p>
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && view === 'grid' && (
        <div className="text-center py-16 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No programs match your filters.</p>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Program?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. All registrations linked to this program will also be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
