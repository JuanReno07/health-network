import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Stethoscope,
  Activity,
  UserCheck,
  Briefcase,
  Image as ImageIcon,
  Bell,
  Settings,
  Users,
  ScrollText,
  FileText,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Building2,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitToPublic,
  children
}) => {
  const {
    currentUser,
    logout,
    activeHospital,
    activeHospitalId,
    setActiveHospitalId,
    theme,
    toggleTheme
  } = useHospital();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  // Navigation Items according to RBAC
  const adminNavItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Manajemen Janji Temu', icon: CalendarCheck },
    { id: 'services', label: 'Layanan Medis (CMS)', icon: Activity },
    { id: 'doctors', label: 'Manajemen Dokter', icon: Stethoscope },
    { id: 'records', label: 'Rekam Medis Pasien', icon: FileText },
    { id: 'recruitment', label: 'Karir & Rekrutmen', icon: Briefcase },
    { id: 'media', label: 'Galeri & Video Center', icon: ImageIcon },
    { id: 'announcements', label: 'Pengumuman & Berita', icon: Bell },
    { id: 'hospital-info', label: 'Informasi Rumah Sakit', icon: Settings },
    { id: 'users', label: 'User & Role Management', icon: Users },
    { id: 'audit-logs', label: 'Audit Trail & Aktivitas', icon: ScrollText }
  ];

  const doctorNavItems = [
    { id: 'doctor-workstation', label: 'My Appointments Queue', icon: CalendarCheck },
    { id: 'records', label: 'Rekam Medis & Diagnosis Pasien', icon: FileText },
    { id: 'doctor-profile', label: 'Profil & Ketersediaan Dokter', icon: Stethoscope }
  ];

  const navItems = isAdmin ? adminNavItems : doctorNavItems;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-medical-600 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {isAdmin ? 'Admin Central' : 'Doctor Workstation'}
            </div>
            <div className="text-[10px] text-slate-400">{activeHospital.shortName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-72 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img
                  src={
                    activeHospitalId === 'nusawardenna'
                      ? '/logo/logo-nusawardenna.png'
                      : '/logo/logo-revenhill.png'
                  }
                  alt={activeHospital.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {isAdmin ? 'MED-ADMIN HQ' : 'DOCTOR PORTAL'}
                </div>
                <div className="text-[10px] text-medical-600 dark:text-medical-400 font-bold uppercase tracking-wider">
                  {activeHospital.shortName} &bull; Hospital Central
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hospital Switcher inside Dashboard (for Admin) */}
          {isAdmin && (
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Fokus Manajemen RS:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setActiveHospitalId('nusawardenna')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all text-center ${
                    activeHospitalId === 'nusawardenna'
                      ? 'bg-medical-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Nusawardenna
                </button>
                <button
                  onClick={() => setActiveHospitalId('revenhill')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all text-center ${
                    activeHospitalId === 'revenhill'
                      ? 'bg-healthemerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Revenhill
                </button>
              </div>
            </div>
          )}

          {/* Nav Items List */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-medical-600 text-white shadow-md shadow-medical-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session & Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* User Info Pill */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-xl object-cover border border-medical-500"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Staff User'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <span className="font-bold text-medical-600 dark:text-medical-400">{currentUser?.role}</span>
                {currentUser?.badgeNumber && <span>&bull; {currentUser.badgeNumber}</span>}
              </div>
            </div>
          </div>

          {/* Quick Actions: Back to Public Portal & Logout */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExitToPublic}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Lihat Tampilan Website Publik"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Web Publik</span>
            </button>

            <button
              onClick={() => {
                logout();
                onExitToPublic();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
              title="Keluar dari sesi dan kembali ke web publik"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
};
