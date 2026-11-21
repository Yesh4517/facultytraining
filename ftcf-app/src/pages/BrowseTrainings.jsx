import { useState, useEffect } from 'react';
import { Search, Filter, Award, Clock, Users, Monitor, MapPin, Layers } from 'lucide-react';
import Layout from '../components/Layout';
import { trainingsApi } from '../api';
import { useNavigate } from 'react-router-dom';

const categoryColors = {
  Technical: 'badge-blue',
  Teaching: 'badge-green',
  Research: 'badge-yellow',
  Leadership: 'bg-purple-100 text-purple-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
};

const modeIcon = { Online: Monitor, 'On-Campus': MapPin, Hybrid: Layers };

const avatarColors = {
  ML: 'from-blue-500 to-indigo-600',
  PA: 'from-green-500 to-emerald-600',
  RG: 'from-amber-500 to-orange-600',
  DS: 'from-cyan-500 to-blue-600',
  AL: 'from-purple-500 to-violet-600',
  CY: 'from-red-500 to-rose-600',
  CD: 'from-teal-500 to-green-600',
  CC: 'from-orange-500 to-amber-600',
};

export default function BrowseTrainings() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState('All');

  useEffect(() => {
    trainingsApi.getAll()
      .then(setTrainings)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Technical', 'Teaching', 'Research', 'Leadership'];
  const modes = ['All', 'Online', 'On-Campus', 'Hybrid'];

  const filtered = trainings.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.provider.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || t.category === category;
    const matchMode = mode === 'All' || t.mode === mode;
    return matchSearch && matchCategory && matchMode;
  });

  return (
    <Layout title="Browse Trainings">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Available Training Programmes</h2>
        <p className="text-indigo-100 text-sm">{trainings.length} programmes · Updated {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Search by title or provider…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  category === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Mode:</span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((t) => {
          const ModeIcon = modeIcon[t.mode] || Monitor;
          const seatsPct = Math.round((t.enrolled / t.seats) * 100);
          return (
            <div key={t._id} className="card hover:shadow-lg transition-shadow flex flex-col">
              {/* Top gradient */}
              <div className={`bg-gradient-to-br ${avatarColors[t.image] || 'from-blue-500 to-indigo-600'} rounded-xl h-28 flex items-center justify-center mb-4`}>
                <span className="text-white text-3xl font-bold opacity-80">{t.image}</span>
              </div>

              <div className="flex items-start justify-between mb-2">
                <span className={categoryColors[t.category] || 'badge-blue'}>{t.category}</span>
                <span className={t.status === 'Full' ? 'badge-red' : 'badge-green'}>{t.status}</span>
              </div>

              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">{t.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{t.provider}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">{t.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Award size={13} className="text-blue-500" />
                  <span>{t.credits} Credits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  <span>{t.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ModeIcon size={13} className="text-purple-500" />
                  <span>{t.mode}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-green-500" />
                  <span>{t.enrolled}/{t.seats} enrolled</span>
                </div>
              </div>

              {/* Seats bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Seats filled</span>
                  <span>{seatsPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${seatsPct >= 90 ? 'bg-red-500' : seatsPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${seatsPct}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/register', { state: { training: t } })}
                  disabled={t.status === 'Full'}
                  className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                    t.status === 'Full'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {t.status === 'Full' ? 'Fully Booked' : 'Register'}
                </button>
                <button className="btn-secondary text-sm py-2 px-3">Details</button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No trainings found for your filters.</p>
          <p className="text-sm mt-1">Try adjusting the search or category.</p>
        </div>
      )}
    </Layout>
  );
}
