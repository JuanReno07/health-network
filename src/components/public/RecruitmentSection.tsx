import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RecruitmentPosition } from '../../types';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  Send,
  X,
  FileText,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  Building2
} from 'lucide-react';
import { sanitizeText, FormRateLimiter } from '../../utils/security';

export const RecruitmentSection: React.FC = () => {
  const { recruitment, activeHospitalId, activeHospital, submitApplication } = useHospital();

  const [selectedPosition, setSelectedPosition] = useState<RecruitmentPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantDiscord, setApplicantDiscord] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter open recruitment positions for current hospital or all
  const openPositions = recruitment.filter(
    pos =>
      pos.status === 'open' &&
      (pos.hospitalId === 'all' || pos.hospitalId === activeHospitalId)
  );

  // If there are NO open positions, the menu/section is automatically hidden as requested!
  if (openPositions.length === 0) {
    return null;
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition) return;

    const cleanName = sanitizeText(applicantName);
    const cleanPhone = sanitizeText(applicantPhone);
    const cleanDiscord = sanitizeText(applicantDiscord);
    const cleanExp = sanitizeText(experience);
    const cleanMotivation = sanitizeText(motivation);

    if (!cleanName || !cleanPhone) {
      alert('Harap lengkapi nama dan nomor telepon aktif Anda.');
      return;
    }

    const rateCheck = FormRateLimiter.canSubmit('recruitment_apply', 5);
    if (!rateCheck.allowed) {
      alert(`Mohon tunggu ${rateCheck.waitSeconds} detik sebelum mengirim lamaran kembali.`);
      return;
    }

    setSubmitting(true);

    submitApplication({
      positionId: selectedPosition.id,
      positionTitle: selectedPosition.position,
      hospitalId: activeHospitalId,
      applicantName: cleanName,
      applicantPhone: cleanPhone,
      applicantDiscord: cleanDiscord,
      experience: cleanExp,
      motivation: cleanMotivation
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitting(false);
    setSubmittedSuccess(true);
  };

  const closeModal = () => {
    setSelectedPosition(null);
    setSubmittedSuccess(false);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantDiscord('');
    setExperience('');
    setMotivation('');
  };

  return (
    <section id="recruitment" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-healthemerald-50 dark:bg-healthemerald-950/60 border border-healthemerald-200 dark:border-healthemerald-800 text-healthemerald-700 dark:text-healthemerald-300 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Penerimaan Staf & Tenaga Kesehatan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Karir & Rekrutmen Tenaga Medis
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Bergabunglah bersama keluarga besar medis {activeHospital.name}. Kami membuka kesempatan bagi paramedis, dokter muda, dan spesialis berbakat.
          </p>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openPositions.map(pos => (
            <div
              key={pos.id}
              className="glass-card rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-healthemerald-100 text-healthemerald-800 dark:bg-healthemerald-950 dark:text-healthemerald-300">
                    {pos.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Dibuka: {pos.openDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                    {pos.position}
                  </h3>
                  <div className="text-xs font-semibold text-medical-600 dark:text-medical-400 mt-1">
                    {pos.department}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                    {pos.description}
                  </p>
                </div>

                {/* Requirements list */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block uppercase">
                    Kualifikasi Utama:
                  </span>
                  {pos.requirements.slice(0, 3).map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-healthemerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{req}</span>
                    </div>
                  ))}
                </div>

                {/* Salary Info */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Estimasi Gaji / Penghasilan</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {pos.salaryInfo}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedPosition(pos);
                    setSubmittedSuccess(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-healthemerald-600 hover:bg-healthemerald-700 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Lamaran Posisi Ini</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Application Modal */}
        {selectedPosition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-healthemerald-700 to-healthemerald-600 text-white p-6 pb-5 relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-healthemerald-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-healthemerald-200">
                    Formulir Lamaran Staf Medis
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  {selectedPosition.position}
                </h3>
                <p className="text-xs text-healthemerald-100">
                  {selectedPosition.department} &bull; {activeHospital.name}
                </p>
              </div>

              {submittedSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-healthemerald-100 text-healthemerald-600 dark:bg-healthemerald-950 dark:text-healthemerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Lamaran Berhasil Dikirim!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    Berkas lamaran Anda telah masuk ke meja Dewan Direksi Medis. Kami akan menghubungi nomor telepon / Discord Anda untuk jadwal wawancara.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl bg-healthemerald-600 hover:bg-healthemerald-700 text-white text-xs font-bold"
                  >
                    Selesai
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap Pelamar *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        placeholder="contoh: Bryan O'Connor"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        No. Telepon / No. HP Aktif *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={applicantPhone}
                          onChange={e => setApplicantPhone(e.target.value)}
                          placeholder="555-0199"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Discord Tag / Kontak
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={applicantDiscord}
                          onChange={e => setApplicantDiscord(e.target.value)}
                          placeholder="bryan#1234"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                        />
                        <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengalaman Medis / Riwayat Pelayanan Sebelumnya
                    </label>
                    <textarea
                      rows={2}
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      placeholder="Jelaskan riwayat pengalaman sebagai paramedis, dokter, atau faksi terkait..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Motivasi Bergabung
                    </label>
                    <textarea
                      rows={2}
                      value={motivation}
                      onChange={e => setMotivation(e.target.value)}
                      placeholder="Alasan Anda ingin mengabdi di rumah sakit ini..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-healthemerald-600 hover:bg-healthemerald-700 shadow-md flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Mengirim...' : 'Submit Lamaran'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
