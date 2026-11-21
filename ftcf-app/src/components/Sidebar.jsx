import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, Upload,
  History, ShieldCheck, Users, BarChart3, LogOut, GraduationCap,
  PlusCircle, ListChecks, CalendarCheck, FileBarChart2, UserCircle,
} from 'lucide-react';
import { useApp } from '../context/useApp';

const facultyLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/browse', label: 'Browse Trainings', icon: BookOpen },
  { to: '/register', label: 'Register Training', icon: ClipboardList },
  { to: '/upload', label: 'Upload Certificate', icon: Upload },
  { to: '/credits', label: 'Credit History', icon: History },
];

const coordinatorLinks = [
  { to: '/coordinator', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/coordinator/create', label: 'Create Training Program', icon: PlusCircle },
  { to: '/coordinator/programs', label: 'Manage Programs', icon: ListChecks },
  { to: '/coordinator/registrations', label: 'Manage Registrations', icon: ClipboardList },
  { to: '/coordinator/attendance', label: 'Record Attendance', icon: CalendarCheck },
  { to: '/verify', label: 'Verify Certificates', icon: ShieldCheck },
  { to: '/coordinator/reports', label: 'Training Reports', icon: FileBarChart2 },
  { to: '/coordinator/profile', label: 'Profile', icon: UserCircle },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/verify', label: 'Verify Certificates', icon: ShieldCheck },
  { to: '/browse', label: 'Browse Trainings', icon: BookOpen },
];

const roleLinks = { faculty: facultyLinks, coordinator: coordinatorLinks, admin: adminLinks };

export default function Sidebar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const links = roleLinks[currentUser.role] || facultyLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col z-30 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-700">
        <div className="bg-white/10 p-2 rounded-lg">
          <GraduationCap className="text-white" size={24} />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">FTCF</p>
          <p className="text-blue-200 text-xs">Training Credits</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-blue-300 text-xs capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-150 ${isActive
                ? 'bg-white text-blue-800'
                : 'text-blue-100 hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-blue-100 hover:bg-white/10 text-sm font-medium transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
