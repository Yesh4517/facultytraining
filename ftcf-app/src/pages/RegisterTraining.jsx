import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, Award, Calendar, User, FileText, BookOpen, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { trainingsApi, registrationsApi } from '../api';
import { useApp } from '../context/useApp';

export default function RegisterTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const preSelected = location.state?.training || null;
  const [trainings, setTrainings]       = useState([]);
  const [selectedId, setSelectedId]     = useState(preSelected?._id || preSelected?.id || '');
  const [justification, setJustification] = useState('');
  const [supervisor, setSupervisor]     = useState('');
  const [agreed, setAgreed]             = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [submittedReg, setSubmittedReg] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    trainingsApi.getAll()
      .then((data) => setTrainings(data))
      .catch((e) => setError(e.message))
      .finally(() => setFetchLoading(false));
  }, []);

  const available = trainings.filter((t) => t.status !== 'Full');
  const selectedTraining = trainings.find((t) => t._id === selectedId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || !selectedId) return;
    setLoading(true);
    setError('');
    try {
      const reg = await registrationsApi.register({
        training: selectedId,
        supervisorName: supervisor,
        justification,
      });
      setSubmittedReg(reg);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && submittedReg) {
    return (
      <Layout title="Register Training">
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
            <p className="text-gray-500 mb-2">
              Your registration for <span className="font-semibold text-gray-700">{submittedReg.training?.title}</span> has been submitted.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              It is now pending coordinator approval. You will be notified once it is reviewed.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Credits</span>
                <span className="font-medium text-gray-800">{submittedReg.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="badge-yellow">Pending</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">{new Date(submittedReg.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">Go to Dashboard</button>
              <button onClick={() => { setSubmitted(false); setSelectedId(''); setJustification(''); setSupervisor(''); setAgreed(false); setSubmittedReg(null); }} className="btn-secondary flex-1">New Registration</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Register Training">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-1">Training Registration Form</h2>
          <p className="text-purple-100 text-sm">Submit a registration request for an upcoming training programme.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Applicant info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input className="input bg-gray-50" value={currentUser?.name || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                <input className="input bg-gray-50" value={currentUser?.department || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                <input className="input bg-gray-50" value={currentUser?.designation || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input className="input bg-gray-50" value={currentUser?.email || ''} readOnly />
              </div>
            </div>
          </div>

          {/* Training selection */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-500" /> Training Programme
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Select Training <span className="text-red-500">*</span></label>
              {fetchLoading ? (
                <div className="input bg-gray-50 flex items-center gap-2 text-gray-400 text-sm">
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Loading…
                </div>
              ) : (
                <select className="input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
                  <option value="">— Select a training programme —</option>
                  {available.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title} ({t.credits} credits · {t.mode})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedTraining && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3">{selectedTraining.title}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-blue-700"><Award size={14} /> <span>{selectedTraining.credits} Credits</span></div>
                  <div className="flex items-center gap-2 text-blue-700"><Calendar size={14} /> <span>{new Date(selectedTraining.startDate).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2 text-blue-700"><ClipboardList size={14} /> <span>{selectedTraining.mode}</span></div>
                  <div className="flex items-center gap-2 text-blue-700"><User size={14} /> <span>{selectedTraining.provider}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Additional info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-amber-500" /> Supporting Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Supervisor / HOD Name <span className="text-red-500">*</span></label>
                <input className="input" placeholder="e.g. Prof. Noor Hassan" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Justification / Learning Objectives <span className="text-red-500">*</span></label>
                <textarea className="input resize-none" rows={4} placeholder="Describe how this training aligns with your professional development goals…" value={justification} onChange={(e) => setJustification(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="card">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600" />
              <span className="text-sm text-gray-600">
                I confirm that the information provided is accurate and I agree to complete the training programme as scheduled. I understand that missing the programme without valid reason may result in credit reversal.
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={!agreed || loading} className={`btn-primary flex-1 py-3 flex items-center justify-center gap-2 ${(!agreed || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Submitting…' : 'Submit Registration'}
            </button>
            <button type="button" onClick={() => navigate('/browse')} className="btn-secondary px-6">Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
