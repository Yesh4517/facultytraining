import { useState } from 'react';
import { Upload, File, CheckCircle, X, AlertCircle, Award } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/useApp';
import { useNavigate } from 'react-router-dom';
import { certificatesApi } from '../api';

const categories = ['Technical', 'Teaching', 'Research', 'Leadership', 'Other'];

export default function UploadCertificate() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    trainingTitle: '',
    provider: '',
    completionDate: '',
    credits: '',
    category: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.trainingTitle) e.trainingTitle = 'Required';
    if (!form.provider) e.provider = 'Required';
    if (!form.completionDate) e.completionDate = 'Required';
    if (!form.credits || isNaN(form.credits) || form.credits <= 0) e.credits = 'Enter a valid number';
    if (!form.category) e.category = 'Required';
    if (!file) e.file = 'Please attach a certificate file';
    return e;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileInput = (e) => {
    const picked = e.target.files[0];
    if (picked) setFile(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('trainingTitle', form.trainingTitle);
      fd.append('provider', form.provider);
      fd.append('completionDate', form.completionDate);
      fd.append('credits', form.credits);
      fd.append('category', form.category);
      fd.append('notes', form.description || '');
      if (file) fd.append('file', file);

      const cert = await certificatesApi.upload(fd);
      setSubmittedData(cert);
      setSubmitted(true);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const updateForm = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  if (submitted) {
    return (
      <Layout title="Upload Certificate">
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="card p-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Uploaded!</h2>
            <p className="text-gray-500 mb-8">
              Your certificate for <span className="font-semibold text-gray-700">"{submittedData?.trainingTitle || form.trainingTitle}"</span> has been submitted for coordinator review.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium">{submittedData?.provider || form.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Credits Claimed</span>
                <span className="font-medium">{submittedData?.credits || form.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{submittedData?.category || form.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="badge-yellow">Pending Review</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/credits')} className="btn-primary flex-1">View Credit History</button>
              <button onClick={() => { setSubmitted(false); setSubmittedData(null); setFile(null); setForm({ trainingTitle: '', provider: '', completionDate: '', credits: '', category: '', description: '' }); }} className="btn-secondary flex-1">Upload Another</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Upload Certificate">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-1">Upload Training Certificate</h2>
          <p className="text-emerald-100 text-sm">Submit your certificate for credit approval by your department coordinator.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* File drop zone */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-emerald-500" /> Certificate File
            </h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <File className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="ml-auto text-gray-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Drag & drop your certificate here</p>
                  <p className="text-gray-400 text-sm mb-4">PDF, JPG, PNG up to 10 MB</p>
                  <label className="btn-secondary cursor-pointer">
                    Browse File
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileInput} />
                  </label>
                </>
              )}
            </div>
            {errors.file && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.file}</p>
            )}
          </div>

          {/* Certificate details */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-blue-500" /> Certificate Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Training / Programme Title <span className="text-red-500">*</span></label>
                <input
                  className={`input ${errors.trainingTitle ? 'border-red-400' : ''}`}
                  placeholder="e.g. Advanced Machine Learning"
                  value={form.trainingTitle}
                  onChange={(e) => updateForm('trainingTitle', e.target.value)}
                />
                {errors.trainingTitle && <p className="mt-1 text-xs text-red-500">{errors.trainingTitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Issuing Organisation <span className="text-red-500">*</span></label>
                <input
                  className={`input ${errors.provider ? 'border-red-400' : ''}`}
                  placeholder="e.g. Coursera, HEC"
                  value={form.provider}
                  onChange={(e) => updateForm('provider', e.target.value)}
                />
                {errors.provider && <p className="mt-1 text-xs text-red-500">{errors.provider}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Completion Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className={`input ${errors.completionDate ? 'border-red-400' : ''}`}
                  value={form.completionDate}
                  onChange={(e) => updateForm('completionDate', e.target.value)}
                />
                {errors.completionDate && <p className="mt-1 text-xs text-red-500">{errors.completionDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Credits to Claim <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className={`input ${errors.credits ? 'border-red-400' : ''}`}
                  placeholder="e.g. 8"
                  value={form.credits}
                  onChange={(e) => updateForm('credits', e.target.value)}
                />
                {errors.credits && <p className="mt-1 text-xs text-red-500">{errors.credits}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category <span className="text-red-500">*</span></label>
                <select
                  className={`input ${errors.category ? 'border-red-400' : ''}`}
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value)}
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Additional Notes (optional)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Any additional context about this certification…"
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Applicant readonly */}
          <div className="card bg-gray-50">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Submitted by</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.designation} · {currentUser?.department}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="btn-success flex-1 py-3 flex items-center justify-center gap-2">
              {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {uploading ? 'Uploading…' : 'Submit Certificate'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary px-6">Cancel</button>
          </div>
          {uploadError && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-2"><AlertCircle size={14} /> {uploadError}</p>
          )}
        </form>
      </div>
    </Layout>
  );
}
