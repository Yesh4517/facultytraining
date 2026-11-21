import { useState } from 'react';
import { Camera, Save, CheckCircle, Mail, Phone, Building2, User, Lock, Bell } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApp } from '../../context/useApp';
import { trainingPrograms, allRegistrations } from '../../data/mockData';

export default function CoordinatorProfile() {
  const { currentUser } = useApp();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+92 300 1234567',
    department: currentUser?.department || '',
    designation: currentUser?.designation || '',
    office: 'Room 204, CS Block',
    bio: 'Department Coordinator with 10+ years of experience in academic training management. Committed to faculty professional development and continuous improvement.',
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Personal Info' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'activity', label: 'Activity' },
  ];

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const myPrograms = trainingPrograms.length;
  const myRegistrations = allRegistrations.length;

  return (
    <Layout title="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile header card */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {currentUser?.avatar}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition">
                <Camera size={14} className="text-gray-600" />
              </button>
            </div>
            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h2>
              <p className="text-gray-500 mt-0.5">{currentUser?.designation}</p>
              <p className="text-gray-400 text-sm">{currentUser?.department} · University</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                <span className="badge-green">Coordinator</span>
                <span className="badge-blue">Active</span>
                <span className="bg-purple-100 text-purple-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {currentUser?.totalCredits} Credits
                </span>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              {[
                { label: 'Programs', value: myPrograms },
                { label: 'Registrations', value: myRegistrations },
                { label: 'Verified', value: 6 },
                { label: 'Reports', value: 4 },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center w-24">
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-gray-200">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px border-b-2 ${activeTab === t.id ? 'border-teal-600 text-teal-700 bg-teal-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Personal Info ── */}
        {activeTab === 'info' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <User size={18} className="text-teal-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input pl-9" value={form.email} onChange={(e) => set('email', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input pl-9" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Department</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input pl-9 bg-gray-50" value={form.department} readOnly />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Designation</label>
                <input className="input bg-gray-50" value={form.designation} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Office Location</label>
                <input className="input" value={form.office} onChange={(e) => set('office', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Bio</label>
                <textarea className="input resize-none" rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6">
                <Save size={16} /> Save Changes
              </button>
              {saved && (
                <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-pulse">
                  <CheckCircle size={16} /> Changes saved!
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Security ── */}
        {activeTab === 'security' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Lock size={18} className="text-teal-500" /> Change Password
            </h3>
            <div className="max-w-md space-y-4">
              {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
              ))}
              <button className="btn-primary mt-2 flex items-center gap-2">
                <Lock size={16} /> Update Password
              </button>
            </div>
            <hr className="my-6 border-gray-100" />
            <h3 className="font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800 text-sm">Authenticator App</p>
                <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account.</p>
              </div>
              <span className="badge-yellow">Not Enabled</span>
            </div>
          </div>
        )}

        {/* ── Preferences ── */}
        {activeTab === 'preferences' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Bell size={18} className="text-teal-500" /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'New Registration Requests', sub: 'Notify when faculty applies for a program', defaultOn: true },
                { label: 'Certificate Submissions', sub: 'Notify when a certificate is uploaded', defaultOn: true },
                { label: 'Attendance Reminders', sub: 'Remind before scheduled sessions', defaultOn: false },
                { label: 'Weekly Summary Email', sub: 'Receive a weekly activity digest', defaultOn: true },
                { label: 'System Announcements', sub: 'Platform updates and maintenance notices', defaultOn: false },
              ].map((pref) => {
                const [on, setOn] = useState(pref.defaultOn);
                return (
                  <div key={pref.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{pref.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{pref.sub}</p>
                    </div>
                    <button onClick={() => setOn(!on)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-teal-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Activity ── */}
        {activeTab === 'activity' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-5">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Published training program', detail: 'Advanced Machine Learning Techniques', time: '2 hours ago', color: 'bg-blue-100 text-blue-600' },
                { action: 'Approved registration', detail: 'Dr. Aisha Rahman → ML Techniques', time: '5 hours ago', color: 'bg-green-100 text-green-600' },
                { action: 'Verified certificate', detail: 'Dr. Kamran Iqbal – Leadership Cert', time: '1 day ago', color: 'bg-purple-100 text-purple-600' },
                { action: 'Recorded attendance', detail: 'Pedagogy Workshop – Day 1', time: '2 days ago', color: 'bg-amber-100 text-amber-600' },
                { action: 'Created draft program', detail: 'Curriculum Design & OBE', time: '3 days ago', color: 'bg-gray-100 text-gray-600' },
                { action: 'Rejected registration', detail: 'Dr. Hina Baig → Research Writing', time: '4 days ago', color: 'bg-red-100 text-red-600' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${a.color}`}>
                    {a.action[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{a.action}</p>
                    <p className="text-xs text-gray-400">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
