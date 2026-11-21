import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, FileText, MapPin, Calendar, Users, Award,
  Upload, CheckCircle, Save, Send, AlertCircle, X, File,
} from 'lucide-react';
import Layout from '../../components/Layout';
import { useApp } from '../../context/useApp';

const categories = ['Technical', 'Teaching', 'Research', 'Leadership', 'Professional Development'];
const modes = ['Online', 'On-Campus', 'Hybrid'];
const audiences = ['All Faculty', 'Junior Faculty', 'Senior Faculty', 'HODs & Senior Faculty', 'Research Faculty', 'New Faculty'];

const emptyForm = {
  title: '', description: '', category: '', provider: '',
  venue: '', mode: '', startDate: '', endDate: '',
  registrationDeadline: '', seats: '', credits: '',
  targetAudience: '', brochureFile: null,
};

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{msg}</p>;
}

function SectionHeader({ icon: Icon, title, color = 'text-blue-500' }) {
  return (
    <h3 className={`font-semibold text-gray-800 mb-5 flex items-center gap-2`}>
      <Icon size={18} className={color} /> {title}
    </h3>
  );
}

export default function CreateTrainingProgram() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const clearError = (key) => setErrors((p) => { const e = { ...p }; delete e[key]; return e; });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Programme title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Select a category';
    if (!form.provider.trim()) e.provider = 'Provider name is required';
    if (!form.mode) e.mode = 'Select a delivery mode';
    if (!form.venue.trim()) e.venue = 'Venue / link is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date';
    if (!form.registrationDeadline) e.registrationDeadline = 'Deadline is required';
    if (form.registrationDeadline && form.startDate && form.registrationDeadline > form.startDate)
      e.registrationDeadline = 'Deadline must be before start date';
    if (!form.seats || isNaN(form.seats) || +form.seats < 1)
      e.seats = 'Enter a valid participant limit';
    if (!form.credits || isNaN(form.credits) || +form.credits < 1)
      e.credits = 'Enter valid credit points';
    if (!form.targetAudience) e.targetAudience = 'Select target audience';
    return e;
  };

  const handlePublish = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const handleDraft = () => {
    if (!form.title.trim()) {
      setErrors({ title: 'A title is required to save as draft' });
      return;
    }
    setSavedAsDraft(true);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) set('brochureFile', f);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted || savedAsDraft) {
    const isDraft = savedAsDraft && !submitted;
    return (
      <Layout title="Create Training Program">
        <div className="max-w-lg mx-auto mt-14 text-center">
          <div className="card p-10">
            <div className={`w-20 h-20 ${isDraft ? 'bg-amber-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {isDraft
                ? <Save className="text-amber-600" size={36} />
                : <CheckCircle className="text-emerald-600" size={36} />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isDraft ? 'Draft Saved!' : 'Program Published!'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isDraft
                ? `"${form.title}" saved as draft. You can publish it from Manage Programs.`
                : `"${form.title}" is now live and open for faculty registration.`}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Category</span><span className="font-medium">{form.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Mode</span><span className="font-medium">{form.mode}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Credits</span><span className="font-medium">{form.credits}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Seats</span><span className="font-medium">{form.seats}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Status</span>
                <span className={isDraft ? 'badge-yellow' : 'badge-green'}>{isDraft ? 'Draft' : 'Published'}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/coordinator/programs')} className="btn-primary flex-1">View Programs</button>
              <button onClick={() => { setForm(emptyForm); setSubmitted(false); setSavedAsDraft(false); setErrors({}); }} className="btn-secondary flex-1">Create Another</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <Layout title="Create Training Program">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-1">Create Training Program</h2>
          <p className="text-teal-100 text-sm">Fill in the details below to create and publish a new training programme for faculty.</p>
        </div>

        <div className="space-y-5">

          {/* ── Section 1: Basic Information ── */}
          <div className="card">
            <SectionHeader icon={BookOpen} title="Programme Information" color="text-teal-500" />
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Programme Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="e.g. Advanced Machine Learning Techniques"
                  value={form.title}
                  onChange={(e) => { set('title', e.target.value); clearError('title'); }}
                />
                <FieldError msg={errors.title} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`input resize-none ${errors.description ? 'border-red-400' : ''}`}
                  rows={4}
                  placeholder="Describe the programme objectives, content, and expected outcomes…"
                  value={form.description}
                  onChange={(e) => { set('description', e.target.value); clearError('description'); }}
                />
                <div className="flex justify-between mt-1">
                  <FieldError msg={errors.description} />
                  <span className="text-xs text-gray-400 ml-auto">{form.description.length}/500</span>
                </div>
              </div>

              {/* Category + Provider */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`input ${errors.category ? 'border-red-400' : ''}`}
                    value={form.category}
                    onChange={(e) => { set('category', e.target.value); clearError('category'); }}
                  >
                    <option value="">Select category…</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <FieldError msg={errors.category} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Provider / Organiser <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input ${errors.provider ? 'border-red-400' : ''}`}
                    placeholder="e.g. HEC Pakistan, Coursera"
                    value={form.provider}
                    onChange={(e) => { set('provider', e.target.value); clearError('provider'); }}
                  />
                  <FieldError msg={errors.provider} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Delivery Details ── */}
          <div className="card">
            <SectionHeader icon={MapPin} title="Delivery & Venue" color="text-purple-500" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Mode <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {modes.map((m) => (
                    <button
                      key={m} type="button"
                      onClick={() => { set('mode', m); clearError('mode'); }}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${form.mode === m
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-teal-400'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.mode} />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Venue / Meeting Link <span className="text-red-500">*</span>
                </label>
                <input
                  className={`input ${errors.venue ? 'border-red-400' : ''}`}
                  placeholder={form.mode === 'Online' ? 'https://zoom.us/j/...' : 'e.g. Seminar Hall A, Block 3'}
                  value={form.venue}
                  onChange={(e) => { set('venue', e.target.value); clearError('venue'); }}
                />
                <FieldError msg={errors.venue} />
              </div>
            </div>
          </div>

          {/* ── Section 3: Dates ── */}
          <div className="card">
            <SectionHeader icon={Calendar} title="Schedule & Deadlines" color="text-amber-500" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`input ${errors.startDate ? 'border-red-400' : ''}`}
                  value={form.startDate}
                  onChange={(e) => { set('startDate', e.target.value); clearError('startDate'); }}
                />
                <FieldError msg={errors.startDate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`input ${errors.endDate ? 'border-red-400' : ''}`}
                  value={form.endDate}
                  onChange={(e) => { set('endDate', e.target.value); clearError('endDate'); }}
                />
                <FieldError msg={errors.endDate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Registration Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`input ${errors.registrationDeadline ? 'border-red-400' : ''}`}
                  value={form.registrationDeadline}
                  onChange={(e) => { set('registrationDeadline', e.target.value); clearError('registrationDeadline'); }}
                />
                <FieldError msg={errors.registrationDeadline} />
              </div>
            </div>
          </div>

          {/* ── Section 4: Capacity & Credits ── */}
          <div className="card">
            <SectionHeader icon={Users} title="Capacity & Credits" color="text-blue-500" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Participant Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="1" max="200"
                  className={`input ${errors.seats ? 'border-red-400' : ''}`}
                  placeholder="e.g. 30"
                  value={form.seats}
                  onChange={(e) => { set('seats', e.target.value); clearError('seats'); }}
                />
                <FieldError msg={errors.seats} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Credit Points <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="1" max="20"
                  className={`input ${errors.credits ? 'border-red-400' : ''}`}
                  placeholder="e.g. 8"
                  value={form.credits}
                  onChange={(e) => { set('credits', e.target.value); clearError('credits'); }}
                />
                <FieldError msg={errors.credits} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Target Audience <span className="text-red-500">*</span>
                </label>
                <select
                  className={`input ${errors.targetAudience ? 'border-red-400' : ''}`}
                  value={form.targetAudience}
                  onChange={(e) => { set('targetAudience', e.target.value); clearError('targetAudience'); }}
                >
                  <option value="">Select audience…</option>
                  {audiences.map((a) => <option key={a}>{a}</option>)}
                </select>
                <FieldError msg={errors.targetAudience} />
              </div>
            </div>

            {/* Credit info box */}
            {form.credits && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <Award size={20} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Faculty who complete this programme will receive <span className="font-bold">{form.credits} training credits</span> upon certificate verification.
                </p>
              </div>
            )}
          </div>

          {/* ── Section 5: Brochure Upload ── */}
          <div className="card">
            <SectionHeader icon={Upload} title="Programme Brochure (Optional)" color="text-rose-500" />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragOver ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
                }`}
            >
              {form.brochureFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-rose-100 p-3 rounded-lg"><File className="text-rose-600" size={22} /></div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">{form.brochureFile.name}</p>
                    <p className="text-xs text-gray-400">{(form.brochureFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => set('brochureFile', null)} className="ml-4 text-gray-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="text-gray-400" size={22} />
                  </div>
                  <p className="text-gray-600 font-medium text-sm mb-1">Drag & drop brochure here</p>
                  <p className="text-gray-400 text-xs mb-4">PDF, DOCX up to 5 MB</p>
                  <label className="btn-secondary text-sm cursor-pointer">
                    Browse File
                    <input type="file" accept=".pdf,.docx,.doc" className="hidden"
                      onChange={(e) => set('brochureFile', e.target.files[0])} />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* ── Creator info ── */}
          <div className="card bg-gray-50">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Created By</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.designation} · {currentUser?.department}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Date</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handlePublish}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-base"
            >
              <Send size={18} /> Publish Program
            </button>
            <button
              type="button"
              onClick={handleDraft}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3 text-base"
            >
              <Save size={18} /> Save as Draft
            </button>
            <button
              type="button"
              onClick={() => navigate('/coordinator')}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition sm:w-auto"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
