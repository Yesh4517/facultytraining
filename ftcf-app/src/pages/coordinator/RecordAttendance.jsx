import { useState } from 'react';
import { CalendarCheck, CheckCircle, Save, Users, Clock } from 'lucide-react';
import Layout from '../../components/Layout';
import { trainingPrograms, allRegistrations } from '../../data/mockData';

const sessions = {
  TP001: ['Session 1 – Introduction', 'Session 2 – Algorithms', 'Session 3 – Neural Nets', 'Session 4 – Optimization'],
  TP002: ['Day 1 – Foundations', 'Day 2 – Active Learning', 'Day 3 – Assessment Design'],
  TP003: ['Day 1 – Research Design', 'Day 2 – Grant Writing'],
  TP004: ['Day 1 – OBE Framework', 'Day 2 – Mapping & Assessment'],
  TP005: ['Day 1 – Vision & Strategy', 'Day 2 – Team Leadership', 'Day 3 – Decision Making', 'Day 4 – Change Management', 'Day 5 – Presentations'],
};

export default function RecordAttendance() {
  const [selectedProgram, setSelectedProgram]   = useState('');
  const [selectedSession,  setSelectedSession]  = useState('');
  const [sessionDate,      setSessionDate]      = useState('');
  const [attendance,       setAttendance]       = useState({});
  const [saved,            setSaved]            = useState(false);

  const program = trainingPrograms.find((p) => p.id === selectedProgram);
  const programSessions = sessions[selectedProgram] || [];

  // Get approved enrollees for selected program
  const enrollees = allRegistrations.filter(
    (r) => r.trainingId === selectedProgram && r.status === 'Approved'
  );

  const toggleAttendance = (id) =>
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));

  const markAll = (val) => {
    const next = {};
    enrollees.forEach((e) => { next[e.id] = val; });
    setAttendance(next);
  };

  const handleSave = () => {
    if (!selectedProgram || !selectedSession || !sessionDate) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount  = enrollees.length - presentCount;

  return (
    <Layout title="Record Attendance">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Record Attendance</h2>
        <p className="text-emerald-100 text-sm">Mark attendance for each training session.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: selector panel */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarCheck size={18} className="text-emerald-500" /> Session Setup
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Training Program</label>
                <select className="input" value={selectedProgram}
                  onChange={(e) => { setSelectedProgram(e.target.value); setSelectedSession(''); setAttendance({}); }}>
                  <option value="">Select program…</option>
                  {trainingPrograms.filter(p => p.status !== 'Draft').map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {selectedProgram && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Session</label>
                  <select className="input" value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                    <option value="">Select session…</option>
                    {programSessions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {selectedProgram && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Date</label>
                  <input type="date" className="input" value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {/* Program info */}
          {program && (
            <div className="card bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Program Details</p>
              <div className="space-y-2 text-sm">
                <div><p className="text-xs text-gray-400">Provider</p><p className="font-medium">{program.provider}</p></div>
                <div><p className="text-xs text-gray-400">Mode</p><p className="font-medium">{program.mode}</p></div>
                <div><p className="text-xs text-gray-400">Credits</p><p className="font-bold text-emerald-700">{program.credits}</p></div>
                <div><p className="text-xs text-gray-400">Enrolled</p><p className="font-medium">{program.enrolled}/{program.seats}</p></div>
              </div>
            </div>
          )}

          {/* Stats */}
          {enrollees.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Session Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Present</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{absentCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Absent</p>
                </div>
              </div>
              {enrollees.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Attendance rate</span>
                    <span>{Math.round((presentCount / enrollees.length) * 100)}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((presentCount / enrollees.length) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: attendance sheet */}
        <div className="xl:col-span-2">
          {!selectedProgram ? (
            <div className="card flex flex-col items-center justify-center py-20 text-gray-400">
              <CalendarCheck size={44} className="opacity-20 mb-4" />
              <p className="font-medium">Select a program to start recording attendance.</p>
            </div>
          ) : enrollees.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-gray-400">
              <Users size={44} className="opacity-20 mb-4" />
              <p className="font-medium">No approved enrollees for this program.</p>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedSession || 'Select a session above'}
                  </h3>
                  {sessionDate && <p className="text-xs text-gray-400 mt-0.5">{sessionDate}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => markAll(true)}
                    className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition">
                    Mark All Present
                  </button>
                  <button onClick={() => markAll(false)}
                    className="text-xs bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition">
                    Mark All Absent
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {enrollees.map((e, idx) => {
                  const isPresent = !!attendance[e.id];
                  return (
                    <div
                      key={e.id}
                      onClick={() => toggleAttendance(e.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                        isPresent
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-gray-50 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xs text-gray-400 w-6 text-center font-medium">{idx + 1}</span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isPresent ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {e.facultyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{e.facultyName}</p>
                        <p className="text-xs text-gray-400">{e.department}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                        isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isPresent
                          ? <><CheckCircle size={12} /> Present</>
                          : <><Clock size={12} /> Absent</>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={!selectedSession || !sessionDate}
                  className={`btn-success flex items-center gap-2 px-6 py-2.5 ${(!selectedSession || !sessionDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={16} /> Save Attendance
                </button>
                {saved && (
                  <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <CheckCircle size={16} /> Attendance saved successfully!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
