import { Bell, Search } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function TopBar({ title }) {
  const { currentUser } = useApp();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-44 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.avatar}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
