import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Activity,
  PhoneCall,
  Calendar,
  Search,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  Stethoscope,
  Clock,
  Radio,
  LogOut,
  LayoutDashboard,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenTracker: () => void;
  onNavigateToBooking: () => void;
  currentView: 'public' | 'dashboard';
  setCurrentView: (view: 'public' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenTracker,
  onNavigateToBooking,
  currentView,
  setCurrentView
}) => {
  const {
    activeHospitalId,
    setActiveHospitalId,
    activeHospital,
    currentUser,
    logout,
    theme,
    toggleTheme
  } = useHospital();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEmergency = activeHospital.emergencyMode;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView === 'dashboard') {
      setCurrentView('public');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang RS' },
    { id: 'services', label: 'Layanan' },
    { id: 'doctors', label: 'Dokter' },
    { id: 'gallery', label: 'Galeri & Video' },
    { id: 'recruitment', label: 'Karir' },
    { id: 'contact', label: 'Kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 font-sans">

      {/* Emergency Ribbon */}
      {isEmergency && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-rose-100 px-4 py-2 border-b border-rose-500/30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2.5 mx-auto truncate">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                SIAGA DARURAT
              </span>
              <span className="text-white font-semibold truncate">
                {activeHospital.shortName}: {activeHospital.emergencyMessage}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-lg border border-rose-800/60 shrink-0 whitespace-nowrap">
              <PhoneCall className="w-3 h-3 text-rose-400" /> Triage Hotline: 911
            </div>
          </div>
        </div>
      )}

      {/* Top Network Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800/90 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3.5 whitespace-nowrap">
            <div className="flex items-center gap-2 text-white font-extrabold tracking-wider uppercase">
              <img src="/logo/logo-kota.png" alt="Logo Kota ASE STATE"
                className="w-5 h-5 object-contain rounded-full bg-white/10 p-0.5 shadow-sm" />
              <span>ASE STATE</span>
            </div>
            <span className="text-slate-700">&bull;</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-healthemerald-400" />
              <span>{activeHospital.contact.operatingHours}</span>
            </div>
            <span className="text-slate-700">&bull;</span>
            <div className="flex items-center gap-1 text-amber-400/90 font-mono text-[11px]">
              <Radio className="w-3 h-3 text-amber-400" />
              <span>{activeHospital.contact.radioFrequency}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Pusat Medis:</span>
            <div className="flex p-0.5 rounded-xl bg-slate-900 border border-slate-800">
              <button onClick={() => setActiveHospitalId('nusawardenna')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  activeHospitalId === 'nusawardenna'
                    ? 'bg-gradient-to-r from-medical-600 to-medical-500 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}>
                <Activity className="w-3 h-3" /><span>RS Nusawardenna</span>
              </button>
              <button onClick={() => setActiveHospitalId('revenhill')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  activeHospitalId === 'revenhill'
                    ? 'bg-gradient-to-r from-healthemerald-600 to-healthemerald-500 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}>
                <Building2 className="w-3 h-3" /><span>MC Revenhill</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-200 ${
        scrolled
          ? 'glass-nav bg-white/95 dark:bg-navy-950/95 shadow-md border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl'
          : 'glass-nav bg-white/90 dark:bg-navy-950/90 shadow-sm border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* LEFT — Brand: logo + name only at lg, + tagline at xl */}
            <div
              onClick={() => { setCurrentView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 p-1 shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
                  <img
                    src={activeHospitalId === 'nusawardenna' ? '/logo/logo-nusawardenna.png' : '/logo/logo-revenhill.png'}
                    alt={activeHospital.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-navy-950 shadow-sm ${
                  activeHospital.status === 'OPEN' ? 'bg-healthemerald-500'
                  : activeHospital.status === 'BUSY' ? 'bg-amber-500' : 'bg-rose-500'
                }`} title={`Status: ${activeHospital.status}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-sm lg:text-base text-slate-900 dark:text-white tracking-tight leading-tight whitespace-nowrap">
                    {activeHospital.name}
                  </span>
                  <span className="hidden xl:inline-block shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    Terakreditasi
                  </span>
                </div>
                {/* Tagline only at xl+ so it doesn't push nav links at lg */}
                <p className="hidden xl:block text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap leading-none mt-0.5">
                  {activeHospital.tagline}
                </p>
              </div>
            </div>

            {/* CENTER — Nav links (desktop) */}
            <nav className="hidden lg:flex items-center gap-0 xl:gap-0.5 shrink-0 mx-auto">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-150 whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* RIGHT — Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <button onClick={onOpenTracker}
                  className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center gap-1 whitespace-nowrap shadow-sm"
                  title="Lacak status janji temu">
                  <Search className="w-3 h-3 text-medical-600 dark:text-medical-400 shrink-0" />
                  <span>Cek Status</span>
                </button>

                <button onClick={onNavigateToBooking}
                  className="h-8 px-3 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-medical-600 via-medical-500 to-healthemerald-600 hover:from-medical-500 hover:to-healthemerald-500 shadow-md shadow-medical-500/20 hover:shadow-glow-blue transition-all flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>Buat Janji</span>
                </button>

                <button onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800 transition-colors flex items-center justify-center shrink-0 shadow-sm"
                  title="Ganti Mode Tema">
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                </button>

                {currentUser ? (
                  <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentView(currentView === 'dashboard' ? 'public' : 'dashboard')}
                      className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap shadow-sm ${
                        currentView === 'dashboard'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800'
                      }`}>
                      {currentView === 'dashboard'
                        ? <><Globe className="w-3 h-3 shrink-0" /><span>Web Publik</span></>
                        : <><LayoutDashboard className="w-3 h-3 shrink-0" /><span>Dashboard</span></>}
                    </button>
                    <button
                      onClick={() => { logout(); setCurrentView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors flex items-center justify-center shrink-0"
                      title="Logout">
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={onOpenLogin}
                    className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all flex items-center gap-1 whitespace-nowrap shadow-sm"
                    title="Login Portal Staff">
                    <User className="w-3 h-3 text-medical-600 dark:text-medical-400 shrink-0" />
                    <span>Portal Staff</span>
                  </button>
                )}
              </div>

              {/* Mobile hamburger */}
              <div className="flex items-center gap-1.5 lg:hidden">
                <button onClick={toggleTheme}
                  className="w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-9 h-9 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Pilih Rumah Sakit:</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setActiveHospitalId('nusawardenna'); setMobileMenuOpen(false); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    activeHospitalId === 'nusawardenna'
                      ? 'bg-medical-600 text-white border-medical-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>RS Nusawardenna</button>
                <button onClick={() => { setActiveHospitalId('revenhill'); setMobileMenuOpen(false); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    activeHospitalId === 'revenhill'
                      ? 'bg-healthemerald-600 text-white border-healthemerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>MC Revenhill</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {link.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button onClick={() => { setMobileMenuOpen(false); onNavigateToBooking(); }}
                className="w-full h-11 px-4 rounded-xl text-center font-bold text-xs text-white bg-medical-600 hover:bg-medical-700 shadow-md flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Buat Janji Dokter Sekarang
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
                  className="h-10 px-3 rounded-xl text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-medical-600" /> Cek Status
                </button>
                {currentUser ? (
                  <button onClick={() => { setMobileMenuOpen(false); setCurrentView(currentView === 'dashboard' ? 'public' : 'dashboard'); }}
                    className="h-10 px-3 rounded-xl text-center text-xs font-bold bg-navy-900 text-white dark:bg-white dark:text-navy-900 flex items-center justify-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {currentView === 'dashboard' ? 'Web Publik' : 'Dashboard'}
                  </button>
                ) : (
                  <button onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                    className="h-10 px-3 rounded-xl text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Portal Staff
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
