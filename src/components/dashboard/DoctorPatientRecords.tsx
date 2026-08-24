import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PatientRecord, Appointment } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Shield,
  Activity,
  User,
  Phone,
  Pill,
  Save,
  X,
  Stethoscope,
  Building2,
  AlertCircle
} from 'lucide-react';

interface DoctorPatientRecordsProps {
  initialAppointment?: Appointment | null;
  onClearInitialAppointment?: () => void;
}

export const DoctorPatientRecords: React.FC<DoctorPatientRecordsProps> = ({
  initialAppointment,
  onClearInitialAppointment
}) => {
  const {
    patientRecords,
    createPatientRecord,
    currentUser,
    doctors,
    activeHospitalId,
    activeHospital
  } = useHospital();

  const currentDoctor = doctors.find(d => d.id === currentUser?.doctorId) || doctors[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterInjury, setFilterInjury] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(Boolean(initialAppointment));
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<PatientRecord | null>(null);

  // Form State
  const [patientName, setPatientName] = useState(initialAppointment?.patientName || '');
  const [patientPhone, setPatientPhone] = useState(initialAppointment?.patientPhone || '');
  const [injuryType, setInjuryType] = useState<PatientRecord['injuryType']>('General Illness');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [surgicalProcedure, setSurgicalProcedure] = useState('');
  const [prescriptions, setPrescriptions] = useState('Paracetamol 500mg (3x1), Amoxicillin 500mg (3x1)');
  const [doctorNotes, setDoctorNotes] = useState('');

  // Sync if initialAppointment changes
  React.useEffect(() => {
    if (initialAppointment) {
      setPatientName(initialAppointment.patientName);
      setPatientPhone(initialAppointment.patientPhone);
      setIsModalOpen(true);
    }
  }, [initialAppointment]);

  const filteredRecords = patientRecords.filter(rec => {
    const matchInjury = filterInjury === 'All' || rec.injuryType === filterInjury;
    const matchSearch =
      rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchInjury && matchSearch;
  });

  const injuryTypes: PatientRecord['injuryType'][] = [
    'Gunshot Wound (GSW)',
    'Blunt Force Trauma',
    'Laceration / Stab',
    'Fracture',
    'Burn',
    'Internal Bleeding',
    'Tox / Overdose',
    'General Illness',
    'Routine Checkup'
  ];

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !diagnosis.trim() || !treatment.trim()) return;

    createPatientRecord({
      appointmentId: initialAppointment?.id,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim() || 'N/A',
      hospitalId: activeHospitalId,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      injuryType,
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      prescriptions: prescriptions.split(',').map(s => s.trim()).filter(Boolean),
      surgicalProcedure: surgicalProcedure.trim() || 'Non-Surgical Medical Management',
      doctorNotes: doctorNotes.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
    if (onClearInitialAppointment) onClearInitialAppointment();

    // Reset Form
    setPatientName('');
    setPatientPhone('');
    setDiagnosis('');
    setTreatment('');
    setSurgicalProcedure('');
    setDoctorNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Rekam Medis Pasien & Catatan Tindakan Klinis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dokumentasi klinis diagnosis, tindakan bedah trauma luka tembak (GSW), fraktur, dan resep obat resmi
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Rekam Medis Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari pasien, diagnosis, ID rekam medis..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <select
            value={filterInjury}
            onChange={e => setFilterInjury(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
          >
            <option value="All">Semua Tipe Cedera / Diagnosis</option>
            {injuryTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecords.map(rec => (
          <div
            key={rec.id}
            className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-medical-600 dark:text-medical-400 block">
                    {rec.id}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                    {rec.patientName}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {rec.patientPhone}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    rec.injuryType.includes('GSW') || rec.injuryType.includes('Trauma')
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300'
                  }`}
                >
                  {rec.injuryType}
                </span>
              </div>

              {/* Diagnosis Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnosis Klinis:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{rec.diagnosis}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Tindakan / Terapi Medis:</span>
                  <div className="text-slate-700 dark:text-slate-300">{rec.treatment}</div>
                </div>

                {rec.surgicalProcedure && (
                  <div>
                    <span className="text-[10px] font-bold text-medical-600 dark:text-medical-400 uppercase block">Prosedur Bedah:</span>
                    <div className="text-slate-800 dark:text-slate-200 font-semibold">{rec.surgicalProcedure}</div>
                  </div>
                )}
              </div>

              {/* Prescriptions */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Resep Obat & Dosis:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rec.prescriptions.map((pill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      <Pill className="w-3 h-3" /> {pill}
                    </span>
                  ))}
                </div>
              </div>

              {rec.doctorNotes && (
                <div className="text-xs text-slate-500 italic bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  "{rec.doctorNotes}"
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <span>Dokter: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.doctorName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]">{rec.date}</span>
                <button
                  onClick={() => setSelectedRecordForPrint(rec)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Cetak Rekam Medis"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Patient Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Formulir Rekam Medis & Diagnosis Pasien
                </h3>
                <p className="text-xs text-slate-400">Dokter Pengisi: {currentDoctor.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onClearInitialAppointment) onClearInitialAppointment();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Pasien *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="contoh: Trevor Philips"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. Telepon Pasien
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value.replace(/[^0-9+-]/g, ''))}
                    placeholder="555-0191"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Kasus / Jenis Tindakan Medis *
                </label>
                <select
                  value={injuryType}
                  onChange={e => setInjuryType(e.target.value as PatientRecord['injuryType'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                >
                  {injuryTypes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnosis Klinis Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="contoh: GSW di paha kanan tanpa keterlibatan arteri femoralis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tindakan & Terapi Penanganan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={treatment}
                  onChange={e => setTreatment(e.target.value)}
                  placeholder="Ekstraksi proyektil, hemostasis jahitan steril, perban kompresi..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prosedur Bedah (Opsional)
                </label>
                <input
                  type="text"
                  value={surgicalProcedure}
                  onChange={e => setSurgicalProcedure(e.target.value)}
                  placeholder="contoh: Minor Emergency Bullet Extraction"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resep Obat (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={prescriptions}
                  onChange={e => setPrescriptions(e.target.value)}
                  placeholder="Ketorolac 10mg (3x1), Cefixime 200mg (2x1)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Instruksi Dokter untuk Pasien
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={e => setDoctorNotes(e.target.value)}
                  placeholder="Istirahat minimal 3 hari, hindari aktivitas berat, kontrol kembali..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Terbitkan Rekam Medis</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Medical Chart Modal */}
      {selectedRecordForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="no-print bg-slate-100 dark:bg-navy-950 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Cetak Lembar Rekam Medis Pasien
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-medical-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak
                </button>
                <button
                  onClick={() => setSelectedRecordForPrint(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="printable-ticket p-8 space-y-6 text-xs text-slate-800 dark:text-slate-200">
              <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold font-display uppercase tracking-tight">
                    {activeHospital.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Departemen Rekam Medis & Kedokteran Kehakiman
                  </p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="font-bold">{selectedRecordForPrint.id}</div>
                  <div>{selectedRecordForPrint.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Pasien:</span>
                  <div className="font-bold text-sm">{selectedRecordForPrint.patientName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Dokter Pemeriksa:</span>
                  <div className="font-bold text-sm">{selectedRecordForPrint.doctorName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Jenis Cedera:</span>
                  <div className="font-bold">{selectedRecordForPrint.injuryType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Prosedur Bedah:</span>
                  <div className="font-semibold">{selectedRecordForPrint.surgicalProcedure}</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Diagnosis Klinis
                </span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium">
                  {selectedRecordForPrint.diagnosis}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Tindakan Medis yang Diberikan
                </span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {selectedRecordForPrint.treatment}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Resep Obat (Rx)
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedRecordForPrint.prescriptions.map((rx, idx) => (
                    <li key={idx} className="font-mono">{rx}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-300 dark:border-slate-700 flex justify-between items-end">
                <div className="text-[10px] text-slate-400 font-mono">
                  SAN ANDREAS MEDICAL AUTHENTICATED
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 mb-8">Tanda Tangan Dokter</div>
                  <div className="font-bold border-t border-slate-400 pt-1">
                    {selectedRecordForPrint.doctorName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
