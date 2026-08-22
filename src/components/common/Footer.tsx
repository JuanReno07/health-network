import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Activity,
  PhoneCall,
  Mail,
  MapPin,
  Shield,
  Clock,
  Radio,
  ExternalLink,
  Heart
} from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
  onNavigateToBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin, onNavigateToBooking }) => {
  const { activeHospital, hospitals, setActiveHospitalId } = useHospital();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Hospital Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-950 border border-slate-700 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                <img
                  src={
                    activeHospital.id === 'nusawardenna'
                      ? '/logo/logo-nusawardenna.png'
                      : '/logo/logo-revenhill.png'
                  }
                  alt={activeHospital.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base block leading-tight">
                  {activeHospital.name}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-medical-400 font-semibold tracking-wide mt-0.5">
                  <img
                    src="/logo/logo-kota.png"
                    alt="ASE STATE"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>ASE STATE Health Authority</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeHospital.description}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-healthemerald-400" /> Terakreditasi Paripurna
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">
                24/7 Trauma Triage
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-medical-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-medical-500" /> Layanan Instalasi Medis
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-medical-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-medical-500" /> Jadwal Dokter & Poliklinik
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateToBooking}
                  className="hover:text-medical-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <span className="w-1 h-1 rounded-full bg-medical-500" /> Pendaftaran Janji Temu Online
                </button>
              </li>
              <li>
                <a href="#gallery" className="hover:text-medical-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-medical-500" /> Galeri Fasilitas & Armada
                </a>
              </li>
              <li>
                <a href="#recruitment" className="hover:text-medical-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-medical-500" /> Karir Paramedik & Dokter
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="text-medical-400 hover:text-medical-300 font-semibold flex items-center gap-1.5 pt-1"
                >
                  <span className="w-1 h-1 rounded-full bg-healthemerald-500" /> Portal Khusus Staff Medis
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Hospitals in Network */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Jaringan Rumah Sakit
            </h3>
            <div className="space-y-2.5">
              <div
                onClick={() => setActiveHospitalId('nusawardenna')}
                className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-medical-500/50 cursor-pointer transition-all"
              >
                <div className="font-semibold text-xs text-white">RS Nusawardenna</div>
                <div className="text-[11px] text-slate-400">Pusat Trauma & IGD Downtown Los Santos</div>
                <div className="text-[10px] text-healthemerald-400 font-medium mt-1">Status: {hospitals.nusawardenna?.status || 'OPEN'}</div>
              </div>

              <div
                onClick={() => setActiveHospitalId('revenhill')}
                className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-healthemerald-500/50 cursor-pointer transition-all"
              >
                <div className="font-semibold text-xs text-white">Medical Center Revenhill</div>
                <div className="text-[11px] text-slate-400">Pusat Bedah Presisi & VIP Rockford Hills</div>
                <div className="text-[10px] text-healthemerald-400 font-medium mt-1">Status: {hospitals.revenhill?.status || 'OPEN'}</div>
              </div>
            </div>
          </div>

          {/* Column 4: Emergency Contacts & Dispatch */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Kontak Darurat & Hotline
            </h3>
            
            <div className="bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Call Center Darurat: 911</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Panggilan langsung menuju unit triage dispatch EMS 24 jam.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-medical-400 shrink-0 mt-0.5" />
                <span>{activeHospital.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeHospital.contact.radioFrequency}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-healthemerald-400 shrink-0" />
                <span>{activeHospital.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {activeHospital.name} &bull; Healthcare Management System.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Wilayah Layanan San Andreas</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-400">
              Dedikasi <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk Pelayanan Pasien
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
