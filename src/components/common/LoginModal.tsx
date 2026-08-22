import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  X,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Stethoscope,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { BruteForceProtector, sanitizeText } from '../../utils/security';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, users, doctors } = useHospital();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Check lockout on mount or update
  useEffect(() => {
    if (!isOpen) return;
    const status = BruteForceProtector.isLocked();
    if (status.locked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          BruteForceProtector.reset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const handleQuickLogin = (role: 'ADMIN' | 'DOCTOR', usernameKey: string) => {
    if (lockoutSeconds > 0) {
      setError(`Sistem terkunci sementara demi keamanan. Coba lagi dalam ${lockoutSeconds} detik.`);
      return;
    }
    setError('');
    BruteForceProtector.recordSuccess();

    const targetUser = users.find(u =>
      u.email.toLowerCase() === usernameKey.toLowerCase() ||
      u.id === usernameKey ||
      (role === 'DOCTOR' && u.doctorId === usernameKey)
    );

    if (targetUser) {
      login(targetUser.role, targetUser.doctorId, targetUser.name, targetUser);
    } else {
      login(role, role === 'DOCTOR' ? (usernameKey || 'doc-1') : undefined);
    }
    onSuccess();
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if system is currently locked
    const lockStatus = BruteForceProtector.isLocked();
    if (lockStatus.locked) {
      setLockoutSeconds(lockStatus.remainingSeconds);
      setError(`Akses diblokir sementara karena terlalu banyak percobaan salah. Tunggu ${lockStatus.remainingSeconds} detik.`);
      return;
    }

    const inputUserKey = sanitizeText(username).toLowerCase();
    const inputPass = password.trim();

    if (!inputUserKey) {
      setError('Silakan masukkan Username / ID Login Anda.');
      return;
    }

    if (!inputPass) {
      setError('Silakan masukkan Password Anda.');
      return;
    }

    // Find in users database by username/email, name, or badge
    const matchedUser = users.find(u =>
      u.email.toLowerCase() === inputUserKey ||
      u.name.toLowerCase() === inputUserKey ||
      (u.badgeNumber && u.badgeNumber.toLowerCase() === inputUserKey) ||
      (u.doctorId && u.doctorId.toLowerCase() === inputUserKey)
    );

    if (matchedUser) {
      // Validate password
      const storedPass = matchedUser.password || '123';
      if (storedPass !== inputPass) {
        const failureResult = BruteForceProtector.recordFailure();
        if (failureResult.locked) {
          setLockoutSeconds(failureResult.remainingSeconds);
          setError(`Terlalu banyak percobaan salah (5x). Sistem dikunci selama ${failureResult.remainingSeconds} detik.`);
        } else {
          setError(`Password salah! Sisa percobaan: ${failureResult.attemptsLeft}x.`);
        }
        return;
      }

      BruteForceProtector.recordSuccess();
      login(matchedUser.role, matchedUser.doctorId, matchedUser.name, matchedUser);
      onSuccess();
      onClose();
      return;
    }

    // Fallback for default 'admin'
    if (inputUserKey === 'admin' && (inputPass === 'admin' || inputPass === '123')) {
      BruteForceProtector.recordSuccess();
      login('ADMIN', undefined, 'Chief Medical Administrator');
      onSuccess();
      onClose();
      return;
    }

    const failureResult = BruteForceProtector.recordFailure();
    if (failureResult.locked) {
      setLockoutSeconds(failureResult.remainingSeconds);
      setError(`Terlalu banyak percobaan salah (5x). Sistem dikunci selama ${failureResult.remainingSeconds} detik.`);
    } else {
      setError(`Username tidak terdaftar! Sisa percobaan: ${failureResult.attemptsLeft}x.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-medical-500 to-healthemerald-500 p-0.5 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-medical-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight text-white">
            Portal Otentikasi Staff Medis
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Masuk ke Sistem Manajemen RS Nusawardenna &amp; MC Revenhill
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Fast 1-Click Demo Logins */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              1-Click Fast Login (Akses Demo):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN', 'admin')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-medical-50 hover:border-medical-500 dark:hover:bg-medical-950/40 border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">Admin Utama</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">user: admin</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('DOCTOR', 'vance')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-healthemerald-50 hover:border-healthemerald-500 dark:hover:bg-healthemerald-950/40 border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-healthemerald-500/10 text-healthemerald-600 dark:text-healthemerald-400 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">Dr. R. Vance</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">user: vance</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-navy-900 px-3 text-[11px] text-slate-400 font-medium absolute">
              atau login dengan akun Anda
            </span>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username / ID Login (Tanpa @)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Contoh: admin / vance / elena"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-semibold focus:ring-2 focus:ring-medical-500 focus:outline-none shadow-sm"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password Akun
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-medical-500 focus:outline-none shadow-sm"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-500 hover:to-medical-600 shadow-md hover:shadow-glow-blue transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
