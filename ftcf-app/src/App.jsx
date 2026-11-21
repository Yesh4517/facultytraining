import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';

// Shared / Faculty pages
import Login from './pages/Login';
import FacultyDashboard from './pages/FacultyDashboard';
import BrowseTrainings from './pages/BrowseTrainings';
import RegisterTraining from './pages/RegisterTraining';
import UploadCertificate from './pages/UploadCertificate';
import CreditHistory from './pages/CreditHistory';
import VerifyCertificates from './pages/VerifyCertificates';

// Coordinator pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CreateTrainingProgram from './pages/coordinator/CreateTrainingProgram';
import ManagePrograms from './pages/coordinator/ManagePrograms';
import ManageRegistrations from './pages/coordinator/ManageRegistrations';
import RecordAttendance from './pages/coordinator/RecordAttendance';
import TrainingReports from './pages/coordinator/TrainingReports';
import CoordinatorProfile from './pages/coordinator/CoordinatorProfile';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import ReportsDashboard from './pages/ReportsDashboard';

// ── Route guards ─────────────────────────────────────────────────────────────

function PrivateRoute({ children, roles }) {
  const { currentUser, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/" replace />;

  if (roles && !roles.includes(currentUser.role)) {
    // Redirect to the user's correct home instead of showing a blank page
    const homeMap = { faculty: '/dashboard', coordinator: '/coordinator', admin: '/admin' };
    return <Navigate to={homeMap[currentUser.role] || '/'} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ── Faculty ── */}
      <Route path="/dashboard"  element={<PrivateRoute roles={['faculty']}><FacultyDashboard /></PrivateRoute>} />
      <Route path="/browse"     element={<PrivateRoute><BrowseTrainings /></PrivateRoute>} />
      <Route path="/register"   element={<PrivateRoute roles={['faculty']}><RegisterTraining /></PrivateRoute>} />
      <Route path="/upload"     element={<PrivateRoute roles={['faculty']}><UploadCertificate /></PrivateRoute>} />
      <Route path="/credits"    element={<PrivateRoute roles={['faculty']}><CreditHistory /></PrivateRoute>} />

      {/* ── Shared ── */}
      <Route path="/verify"     element={<PrivateRoute roles={['coordinator', 'admin']}><VerifyCertificates /></PrivateRoute>} />

      {/* ── Coordinator ── */}
      <Route path="/coordinator"                element={<PrivateRoute roles={['coordinator']}><CoordinatorDashboard /></PrivateRoute>} />
      <Route path="/coordinator/create"         element={<PrivateRoute roles={['coordinator']}><CreateTrainingProgram /></PrivateRoute>} />
      <Route path="/coordinator/programs"       element={<PrivateRoute roles={['coordinator']}><ManagePrograms /></PrivateRoute>} />
      <Route path="/coordinator/registrations"  element={<PrivateRoute roles={['coordinator']}><ManageRegistrations /></PrivateRoute>} />
      <Route path="/coordinator/attendance"     element={<PrivateRoute roles={['coordinator']}><RecordAttendance /></PrivateRoute>} />
      <Route path="/coordinator/reports"        element={<PrivateRoute roles={['coordinator']}><TrainingReports /></PrivateRoute>} />
      <Route path="/coordinator/profile"        element={<PrivateRoute roles={['coordinator', 'faculty', 'admin']}><CoordinatorProfile /></PrivateRoute>} />

      {/* ── Admin ── */}
      <Route path="/admin"      element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/reports"    element={<PrivateRoute roles={['admin']}><ReportsDashboard /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
