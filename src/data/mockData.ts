import {
  Hospital,
  Service,
  Doctor,
  Appointment,
  PatientRecord,
  GalleryItem,
  VideoItem,
  RecruitmentPosition,
  Announcement,
  AuditLog,
  User
} from '../types';

export const INITIAL_HOSPITALS: Record<string, Hospital> = {
  nusawardenna: {
    id: 'nusawardenna',
    name: 'Rumah Sakit Nusawardenna',
    shortName: 'RS Nusawardenna',
    tagline: 'Pusat Layanan Medis Terpadu & Trauma Center Utama',
    logo: '/logo/logo-nusawardenna.png',
    cityLogo: '/logo/logo-kota.png',
    description: 'Rumah Sakit Nusawardenna merupakan institusi medis pemerintah dan trauma center rujukan tingkat satu di Los Santos. Dilengkapi dengan fasilitas gawat darurat modern 24/7, unit bedah terpadu, dan armada Air Ambulance siap siaga.',
    history: 'Didirikan pada tahun 1988 oleh Dewan Kota San Andreas, RS Nusawardenna telah berkembang dari klinik distrik darurat menjadi fasilitas kesehatan trauma terlengkap. Menjadi garda terdepan penyelamatan korban insiden berskala besar, kecelakaan lalu lintas, dan tindakan bedah kritis di seluruh wilayah kepulauan.',
    vision: [
      'Menjadi pusat rujukan trauma dan perawatan gawat darurat medis berstandar internasional terdepan di San Andreas.',
      'Memberikan pelayanan kesehatan yang cepat, tanggap, humanis, dan tanpa diskriminasi bagi seluruh warga kota.'
    ],
    mission: [
      'Menyelenggarakan penanganan gawat darurat trauma 24 jam dengan respon helikopter & ambulans cepat di bawah 3 menit.',
      'Mengembangkan riset kedokteran forensik, bedah kardiovaskular, dan rehabilitasi intensif.',
      'Membangun koordinasi taktis bersama Departemen Kepolisian & Dinas Pemadam Kebakaran dalam manajemen bencana kota.'
    ],
    director: {
      name: 'Dr. Raymond Vance, Sp.B(K)Trauma',
      title: 'Direktur Utama RS Nusawardenna & Kepala Dewan Medis Distrik',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      message: 'Keselamatan nyawa setiap warga negara adalah sumpah suci kami. Setiap detik di IGD Nusawardenna adalah dedikasi tanpa henti untuk memastikan detak jantung harapan tetap berdenyut di kota ini.'
    },
    orgStructure: [
      { id: '1', department: 'Direksi Utama', name: 'Dr. Raymond Vance, Sp.B', role: 'Direktur Utama', badge: 'NW-DIR-01' },
      { id: '2', department: 'Emergency & Trauma (IGD)', name: 'Dr. Elena Rostova, Sp.An', role: 'Kepala Instalasi Gawat Darurat', badge: 'NW-MED-12' },
      { id: '3', department: 'Bedah Umum & Forensik', name: 'Dr. Alexander King, Sp.OT', role: 'Kepala Departemen Bedah & Forensik', badge: 'NW-MED-15' },
      { id: '4', department: 'Divisi Paramedic EMS Taktis', name: 'Capt. Bryan O\'Connor, EMT-P', role: 'Kepala Operasional EMS & Helipad', badge: 'NW-EMS-07' }
    ],
    location: {
      address: 'Jl. Pillbox Central Blvd No. 101, Downtown District',
      district: 'Downtown Los Santos',
      coordinates: '34.0522° N, 118.2437° W',
      mapPreviewUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
    },
    contact: {
      phone: '(021) 555-0199 / 911-NW',
      emergencyPhone: '911 (Triage Dispatch)',
      radioFrequency: 'Freq 911.1 MHz (Medical Police Band)',
      email: 'emergency@nusawardenna.hospital.gov',
      discordServer: 'discord.gg/nusawardenna-ems',
      instagram: '@nusawardenna.medical',
      operatingHours: '24 Jam Setiap Hari (IGD & Trauma Center)'
    },
    status: 'OPEN',
    emergencyMode: false,
    emergencyMessage: 'IGD Siaga Level 1 - Tim Bedah & Respon Cepat Siaga 24 Jam.',
    stats: {
      patientsServed: 7850,
      staffCount: 142,
      satisfactionRate: 98.4,
      emergencyResponseTime: '< 3 Menit'
    }
  },
  revenhill: {
    id: 'revenhill',
    name: 'Medical Center Revenhill',
    shortName: 'MC Revenhill',
    tagline: 'Precision Healthcare & Advanced Surgical Institute',
    logo: '/logo/logo-revenhill.png',
    cityLogo: '/logo/logo-kota.png',
    description: 'Medical Center Revenhill adalah rumah sakit spesialis modern dan pusat inovasi bedah presisi swasta di Rockford Hills. Menghadirkan teknologi robotik medis, perawatan VIP eksklusif, neurologi, dan kardiologi mutakhir.',
    history: 'Didirikan pada tahun 2012 sebagai institut medis swasta berteknologi tinggi, Revenhill bertransformasi menjadi pusat rujukan bedah saraf, ortopedi kosmetik, dan pemulihan VIP para elit kota serta masyarakat umum yang membutuhkan pelayanan medis presisi.',
    vision: [
      'Menjadi pelopor teknologi kesehatan mutakhir dan pelayanan bedah minimal invasif di San Andreas.',
      'Menyediakan fasilitas perawatan privat bintang lima dengan tingkat kesembuhan klinis tertinggi.'
    ],
    mission: [
      'Menerapkan kecerdasan buatan, teknologi imaging 4D, dan prosedur bedah robotik presisi tinggi.',
      'Menyediakan suite rawat inap VIP eksekutif dengan privasi dan kenyamanan maksimal bagi pasien.',
      'Melatih dokter spesialis muda dalam bidang kardiologi intervensi dan bedah rekonstruksi.'
    ],
    director: {
      name: 'Dr. Kimberly Sterling, MD, Ph.D, FACS',
      title: 'Direktur Eksekutif & Konsultan Bedah Saraf Robotik',
      photo: 'https://images.unsplash.com/photo-1594824813637-43f11075d94e?auto=format&fit=crop&w=600&q=80',
      message: 'Di Revenhill, kami menggabungkan kehangatan pelayanan manusiawi dengan kecanggihan teknologi bedah tertinggi untuk memberikan hasil klinis yang sempurna.'
    },
    orgStructure: [
      { id: '1', department: 'Executive Directorate', name: 'Dr. Kimberly Sterling, MD', role: 'Executive Medical Director', badge: 'RH-DIR-01' },
      { id: '2', department: 'Neuro-Cardiology & Robotics', name: 'Dr. Kenji Sato, Sp.BS', role: 'Head of Robotic Neurosurgery', badge: 'RH-SURG-04' },
      { id: '3', department: 'Executive Inpatient & VIP Suite', name: 'Dr. Sarah Al-Mansoor, Sp.PD-KKV', role: 'Chief of Specialized Medicine', badge: 'RH-MED-09' },
      { id: '4', department: 'Advanced Diagnostics & MRI', name: 'Dr. Marcus Holloway, Sp.Rad', role: 'Director of Imaging & Pathology', badge: 'RH-RAD-02' }
    ],
    location: {
      address: '240 Dorset Drive, Rockford Hills Medical Plaza',
      district: 'Rockford Hills / Vinewood West',
      coordinates: '34.0736° N, 118.4004° W',
      mapPreviewUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    },
    contact: {
      phone: '(021) 555-8888 / 911-RH',
      emergencyPhone: '911 (VIP EMS Hotline)',
      radioFrequency: 'Freq 911.4 MHz (Revenhill Medical Desk)',
      email: 'concierge@revenhillmedical.com',
      discordServer: 'discord.gg/revenhill-medical',
      instagram: '@revenhill.medicalcenter',
      operatingHours: 'Pelayanan Poliklinik 07.00 - 22.00 | IGD & ICU 24 Jam'
    },
    status: 'OPEN',
    emergencyMode: false,
    emergencyMessage: 'Operating Theatre & Suite Rawat Inap Siaga Penuh.',
    stats: {
      patientsServed: 5320,
      staffCount: 96,
      satisfactionRate: 99.2,
      emergencyResponseTime: '< 4 Menit'
    }
  }
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    hospitalId: 'all',
    title: 'Instalasi Gawat Darurat (IGD 24 Jam)',
    category: 'Emergency',
    description: 'Pelayanan triase darurat, resusitasi jantung paru, penanganan luka trauma tembak (GSW), fraktur mayor, dan kecelakaan kritis 24/7.',
    icon: 'Siren',
    status: 'active',
    features: ['Triase Cepat Trauma Level 1', 'Ruang Resusitasi Kritis', 'Armada EMS Siaga 24 Jam', 'Peralatan Defibrillator & Ventilator'],
    operatingHours: '24 Jam Non-Stop'
  },
  {
    id: 'srv-2',
    hospitalId: 'all',
    title: 'Departemen Bedah & Kamar Operasi Terpadu',
    category: 'Surgery',
    description: 'Tindakan pembedahan mayor, laparoskopi, ekstraksi peluru, rekonstruksi fraktur, bedah vaskular, dan anestesiologis profesional.',
    icon: 'Activity',
    status: 'active',
    features: ['Ruang Operasi Bertekanan Positif', 'Bedah Laparoskopi Minimal Invasif', 'C-Arm X-Ray Realtime', 'Unit Pemulihan Pasca Anestesi (PACU)'],
    operatingHours: '24 Jam (Operasi Cito) & 08.00 - 20.00 (Elektif)'
  },
  {
    id: 'srv-3',
    hospitalId: 'all',
    title: 'Instalasi Farmasi & Depo Obat Klinis',
    category: 'Support',
    description: 'Penyediaan obat-obatan esensial, antibiotik, analgesik spektrum luas, medikasi trauma pasca operasi, dan konsultasi apoteker.',
    icon: 'Pill',
    status: 'active',
    features: ['Depo Farmasi IGD 24 Jam', 'Obat Resep Dokter Terverifikasi', 'Penyimpanan Suhu Dingin Presisi', 'Konseling Penggunaan Obat'],
    operatingHours: '24 Jam'
  },
  {
    id: 'srv-4',
    hospitalId: 'all',
    title: 'Laboratorium & Patologi Forensik',
    category: 'Diagnostic',
    description: 'Pemeriksaan darah lengkap, tes toksikologi, uji balistik forensik kepolisian, analisis DNA, dan patologi anatomi klinis.',
    icon: 'FlaskConical',
    status: 'active',
    features: ['Uji Toksikologi Narkotika & Racun', 'Pemeriksaan Golongan Darah & Hemoglobin', 'Hasil Cepat di Bawah 15 Menit', 'Laporan Medis Resmi Legal'],
    operatingHours: '24 Jam'
  },
  {
    id: 'srv-5',
    hospitalId: 'revenhill',
    title: 'Robotic Neurosurgery & Bedah Saraf',
    category: 'Surgery',
    description: 'Institut bedah saraf mikro dengan navigasi robotik untuk penanganan cedera kepala berat, aneurisma otak, dan rekonstruksi tulang belakang.',
    icon: 'Brain',
    status: 'active',
    features: ['Navigasi 3D Intraoperatif', 'Stereotactic Brain Surgery', 'Monitoring Saraf Realtime', 'Kamar Operasi Hibrida Modern'],
    operatingHours: 'Senin - Sabtu: 08.00 - 18.00 (Emergency 24 Jam)'
  },
  {
    id: 'srv-6',
    hospitalId: 'nusawardenna',
    title: 'Air Ambulance & Paramedic Helipad',
    category: 'Emergency',
    description: 'Evakuasi medis udara cepat via helikopter untuk evakuasi korban kecelakaan di pegunungan Chiliad, laut, dan insiden antar distrik.',
    icon: 'HeartPulse',
    status: 'active',
    features: ['Helipad Rooftop Berstandar ICAO', 'Dukungan ICU Terbang Lengkap', 'Waktu Lepas Landas < 90 Detik', 'Koordinasi Langsung Polisi & Pemadam'],
    operatingHours: '24 Jam Setiap Hari'
  },
  {
    id: 'srv-7',
    hospitalId: 'revenhill',
    title: 'Radiologi & 4D Full Body Imaging (MRI/CT)',
    category: 'Diagnostic',
    description: 'Pemeriksaan pencitraan radiologi canggih 256-Slice CT Scan, MRI 3 Tesla, dan USG Doppler vaskular untuk diagnosa presisi.',
    icon: 'Stethoscope',
    status: 'active',
    features: ['MRI 3.0 Tesla Silent Scan', 'CT Scan 256-Slice Ultra Fast', 'Deteksi Fraktur & Pendarahan Internal', 'Hasil Digital Terintegrasi'],
    operatingHours: '24 Jam (Emergency) | 07.00 - 22.00 (Rutin)'
  },
  {
    id: 'srv-8',
    hospitalId: 'all',
    title: 'Intensive Care Unit (ICU & HCU)',
    category: 'Inpatient',
    description: 'Perawatan kritis intensif bagi pasien pasca bedah berat, syok septik, trauma multipel dengan pengawasan dokter spesialis anestesi.',
    icon: 'Activity',
    status: 'active',
    features: ['Monitor Vital Sign Multi-Parameter', 'Mechanical Ventilator Otomatis', 'Rasio Perawat 1:1 Pasien Kritis', 'Isolasi Infeksi Khusus'],
    operatingHours: '24 Jam (Akses Pengunjung Terbatas)'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    hospitalId: 'nusawardenna',
    name: 'Dr. Raymond Vance, Sp.B(K)Trauma',
    title: 'Spesialis Bedah Trauma & Konsultan Kritis',
    specialization: 'Trauma & Emergency Surgery',
    department: 'Instalasi Bedah & IGD',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Berpengalaman lebih dari 15 tahun dalam manajemen trauma massal, bedah luka tembak darurat, dan resusitasi kritis di berbagai rumah sakit trauma internasional.',
    schedule: 'Senin - Kamis (08.00 - 16.00)',
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis'],
    availableTimeSlots: ['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30'],
    experience: '15+ Tahun Pengalaman',
    availability: 'Available',
    status: 'active',
    badgeNumber: 'NW-MED-01',
    phone: '555-8101',
    email: 'r.vance@nusawardenna.hospital.gov'
  },
  {
    id: 'doc-2',
    hospitalId: 'nusawardenna',
    name: 'Dr. Elena Rostova, Sp.An, KIC',
    title: 'Spesialis Anestesi & Konsultan Perawatan Intensif',
    specialization: 'Anesthesiology & ICU Management',
    department: 'Intensive Care Unit (ICU)',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Ahli manajemen jalan napas sulit, manajemen nyeri trauma akut, dan monitoring hemodinamik pasien kritis pasca operasi besar.',
    schedule: 'Selasa - Jumat (10.00 - 18.00)',
    availableDays: ['Selasa', 'Rabu', 'Kamis', 'Jumat'],
    availableTimeSlots: ['10:30', '11:30', '13:30', '14:30', '15:30', '16:30', '17:30'],
    experience: '10 Tahun Pengalaman',
    availability: 'Available',
    status: 'active',
    badgeNumber: 'NW-MED-12',
    phone: '555-8102',
    email: 'e.rostova@nusawardenna.hospital.gov'
  },
  {
    id: 'doc-3',
    hospitalId: 'revenhill',
    name: 'Dr. Kimberly Sterling, MD, Ph.D',
    title: 'Executive Director & Konsultan Bedah Saraf',
    specialization: 'Robotic Neurosurgery & Spine',
    department: 'Institute of Neurosciences',
    photo: 'https://images.unsplash.com/photo-1594824813637-43f11075d94e?auto=format&fit=crop&w=600&q=80',
    bio: 'Pelopor teknik bedah saraf navigasi robotik minimal invasif. Menyelesaikan fellowship neurosurgery di Johns Hopkins Hospital.',
    schedule: 'Senin - Rabu (09.00 - 15.00)',
    availableDays: ['Senin', 'Selasa', 'Rabu'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    experience: '14 Tahun Pengalaman',
    availability: 'Available',
    status: 'active',
    badgeNumber: 'RH-DIR-01',
    phone: '555-9001',
    email: 'k.sterling@revenhillmedical.com'
  },
  {
    id: 'doc-4',
    hospitalId: 'revenhill',
    name: 'Dr. Kenji Sato, Sp.JP, FIHA',
    title: 'Spesialis Jantung & Pembuluh Darah',
    specialization: 'Interventional Cardiology',
    department: 'Cardiovascular Center',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Spesialis kateterisasi jantung (PCI), pemasangan stent vaskular, dan rehabilitasi kardiologis pasca infark miokard akut.',
    schedule: 'Rabu - Sabtu (08.30 - 16.30)',
    availableDays: ['Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    availableTimeSlots: ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30', '16:30'],
    experience: '12 Tahun Pengalaman',
    availability: 'Busy',
    status: 'active',
    badgeNumber: 'RH-CARD-04',
    phone: '555-9004',
    email: 'k.sato@revenhillmedical.com'
  },
  {
    id: 'doc-5',
    hospitalId: 'both',
    name: 'Dr. Maya Lin, Sp.FM, M.Kes',
    title: 'Spesialis Kedokteran Forensik & Medikolegal',
    specialization: 'Forensic Pathology & Ballistics',
    department: 'Instalasi Forensik & Toksikologi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Menangani visum et repertum resmi, identifikasi luka balistik senjata api, toksikologi zat kimia, dan otopsi medikolegal resmi kepolisian.',
    schedule: 'Senin - Jumat (09.00 - 17.00)',
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'],
    experience: '9 Tahun Pengalaman',
    availability: 'Available',
    status: 'active',
    badgeNumber: 'NW-FOR-08',
    phone: '555-8108',
    email: 'm.lin@forensic.gov'
  },
  {
    id: 'doc-6',
    hospitalId: 'nusawardenna',
    name: 'Dr. Marcus Holloway, Sp.OT',
    title: 'Spesialis Bedah Ortopedi & Traumatologi Tulang',
    specialization: 'Orthopedic & Fracture Reconstruction',
    department: 'Departemen Bedah Tulang',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Spesialis reduksi terbuka dan fiksasi internal (ORIF) fraktur multipel, rekonstruksi ligamen, dan perawatan trauma muskuloskeletal berat.',
    schedule: 'Senin, Rabu, Jumat (13.00 - 20.00)',
    availableDays: ['Senin', 'Rabu', 'Jumat'],
    availableTimeSlots: ['13:30', '14:30', '15:30', '16:30', '18:30', '19:30', '20:30'],
    experience: '11 Tahun Pengalaman',
    availability: 'Offline',
    status: 'active',
    badgeNumber: 'NW-ORTH-03',
    phone: '555-8103',
    email: 'm.holloway@nusawardenna.hospital.gov'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'NW-2026-8921',
    patientName: 'Franklin Clinton',
    patientPhone: '555-0142',
    patientDob: '1998-05-14',
    patientGender: 'Laki-laki',
    complaint: 'Kontrol rutin pasca operasi pelepasan jahitan luka di bahu kiri akibat insiden kecelakaan motor.',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-1',
    doctorName: 'Dr. Raymond Vance, Sp.B(K)Trauma',
    date: '2026-08-23',
    time: '10:00',
    status: 'Accepted',
    notes: 'Pasien membawa rontgen kontrol dari klinik distrik.',
    doctorNotes: 'Kondisi luka mengering dengan baik, tidak ada tanda infeksi. Jadwalkan pelepasan perban steril.',
    createdAt: '2026-08-21 14:30',
    updatedAt: '2026-08-21 15:00'
  },
  {
    id: 'RH-2026-4412',
    patientName: 'Beverly Felton',
    patientPhone: '555-0899',
    patientDob: '1990-11-20',
    patientGender: 'Perempuan',
    complaint: 'Nyeri dada intermiten dan sesak napas saat beraktivitas berat di Vinewood Hills.',
    hospitalId: 'revenhill',
    doctorId: 'doc-4',
    doctorName: 'Dr. Kenji Sato, Sp.JP, FIHA',
    date: '2026-08-23',
    time: '14:30',
    status: 'Pending',
    notes: 'Meminta kamar konsultasi privat VIP.',
    doctorNotes: '',
    createdAt: '2026-08-22 09:15',
    updatedAt: '2026-08-22 09:15'
  },
  {
    id: 'NW-2026-7731',
    patientName: 'Trevor Philips',
    patientPhone: '555-0191',
    patientDob: '1984-02-12',
    patientGender: 'Laki-laki',
    complaint: 'Pemeriksaan rutin tulang rusuk kanan yang nyeri dan pusing kronis.',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-6',
    doctorName: 'Dr. Marcus Holloway, Sp.OT',
    date: '2026-08-22',
    time: '11:00',
    status: 'Completed',
    notes: 'Pasien datang dengan rujukan paramedis Sandy Shores.',
    doctorNotes: 'Ditemukan retak mikro pada iga ke-7 dexter. Diberikan perban kompresi dan analgetik ketorolac.',
    createdAt: '2026-08-20 08:00',
    updatedAt: '2026-08-22 11:45'
  }
];

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'REC-2026-001',
    appointmentId: 'NW-2026-7731',
    patientName: 'Trevor Philips',
    patientPhone: '555-0191',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-6',
    doctorName: 'Dr. Marcus Holloway, Sp.OT',
    injuryType: 'Fracture',
    diagnosis: 'Closed hairline fracture of 7th right rib without hemothorax',
    treatment: 'Thoracic stabilization wrap, bed rest rekomendasi 7 hari, monitoring pernapasan berkala.',
    prescriptions: ['Ketorolac 10mg tab (3x1)', 'Paracetamol 500mg (3x1 prn)', 'Calcium Carbonate 500mg (1x1)'],
    surgicalProcedure: 'Non-Surgical Conservative Immobilization',
    doctorNotes: 'Pasien diimbau untuk tidak melakukan aktivitas mengangkat beban berat dan menghindari benturan fisik.',
    date: '2026-08-22'
  },
  {
    id: 'REC-2026-002',
    patientName: 'Michael De Santa',
    patientPhone: '555-0120',
    hospitalId: 'revenhill',
    doctorId: 'doc-3',
    doctorName: 'Dr. Kimberly Sterling, MD, Ph.D',
    injuryType: 'Blunt Force Trauma',
    diagnosis: 'Cervical spine strain & mild post-traumatic tension headache',
    treatment: 'Soft cervical collar therapy, fisioterapi otot leher, medikasi relaksan otot.',
    prescriptions: ['Eperisone HCl 50mg (3x1)', 'Ibuprofen 400mg (2x1 pc)', 'Vitamin B Complex (1x1)'],
    surgicalProcedure: 'None',
    doctorNotes: 'MRI servikal menunjukkan tidak ada kompresi diskus. Respon terapi konservatif sangat baik.',
    date: '2026-08-19'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    hospitalId: 'nusawardenna',
    title: 'Gedung Utama Trauma Center RS Nusawardenna',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    description: 'Fasad modern dengan akses cepat jalur IGD, zona dekontaminasi dan parkir armada medis terpadu.',
    date: '2026-08-10'
  },
  {
    id: 'gal-2',
    hospitalId: 'nusawardenna',
    title: 'Unit Resusitasi Kritis & Trauma Bay IGD',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Peralatan monitoring hemodinamik terintegrasi dengan ventilator canggih untuk penyelamatan darurat.',
    date: '2026-08-12'
  },
  {
    id: 'gal-3',
    hospitalId: 'all',
    title: 'Armada Paramedic Rapid Response & Ambulance Type A',
    category: 'Ambulance & EMS',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80',
    description: 'Unit ambulans ICU bergerak dengan peralatan suction, AED, dan radio taktis gelombang darurat kota.',
    date: '2026-08-14'
  },
  {
    id: 'gal-4',
    hospitalId: 'revenhill',
    title: 'Modern Robotic Operating Theatre Suite',
    category: 'Surgical Theatres',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    description: 'Ruang operasi hibrida berteknologi navigasi 3D dan filtrasi HEPA aliran udara laminar steril.',
    date: '2026-08-16'
  },
  {
    id: 'gal-5',
    hospitalId: 'nusawardenna',
    title: 'Tim Paramedik & Dokter Trauma Siaga Siang-Malam',
    category: 'Medical Staff',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80',
    description: 'Koordinasi taktis berkala para perawat, paramedis, dan dokter spesialis sebelum pergantian shift.',
    date: '2026-08-18'
  },
  {
    id: 'gal-6',
    hospitalId: 'revenhill',
    title: 'Executive VIP Inpatient Suite & Lounge',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    description: 'Kamar rawat inap privat bernuansa tenang dengan layanan concierge medis 24 jam.',
    date: '2026-08-20'
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    hospitalId: 'nusawardenna',
    title: 'RS Nusawardenna Official Profile & Emergency Response',
    type: 'Profile',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    duration: '03:45',
    description: 'Dokumentasi komprehensif fasilitas gawat darurat, helipad air ambulance, dan dedikasi tim medis Nusawardenna.'
  },
  {
    id: 'vid-2',
    hospitalId: 'revenhill',
    title: 'Medical Center Revenhill: Precision In Health Innovation',
    type: 'Trailer',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    duration: '02:30',
    description: 'Tur sinematik kamar operasi robotik, suite VIP eksklusif, dan keunggulan teknologi imaging radiologi.'
  },
  {
    id: 'vid-3',
    hospitalId: 'all',
    title: 'Edukasi Medis: Prosedur Pertolongan Pertama Pada Luka Trauma',
    type: 'Education',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    duration: '05:12',
    description: 'Panduan warga mengenai langkah awal penanganan pendarahan darurat sebelum kedatangan ambulans 911.'
  }
];

export const INITIAL_RECRUITMENT: RecruitmentPosition[] = [
  {
    id: 'rec-1',
    hospitalId: 'nusawardenna',
    position: 'Tactical Paramedic & Emergency Dispatcher (EMT-B / EMT-P)',
    department: 'EMS & Ambulance Division',
    description: 'Bertanggung jawab dalam merespon panggilan darurat 911 di seluruh kota, mengoperasikan armada ambulans berkecepatan tinggi, dan memberikan pertolongan pertama di TKP.',
    requirements: [
      'Warga San Andreas dengan lisensi mengemudi aktif',
      'Memiliki sertifikasi Bantuan Hidup Dasar (BHD / BTCLS) aktif',
      'Mampu berkomunikasi taktis via radio frekuensi medis terpadu',
      'Memiliki kedisiplinan dan kesiapan on-duty minimal 8 jam/minggu'
    ],
    salaryInfo: '$4,500 - $7,000 / Periode Gaji + Bonus Operasional Respon',
    type: 'Paramedic',
    status: 'open',
    openDate: '2026-08-15'
  },
  {
    id: 'rec-2',
    hospitalId: 'revenhill',
    position: 'Resident Medical Doctor (Dokter Muda / Spesialis Magang)',
    department: 'Clinical Medicine & Poliklinik',
    description: 'Melakukan pemeriksaan fisik pasien umum, membuat diagnosa klinis, membantu dokter spesialis senior di ruang operasi, dan menyusun rekam medis digital.',
    requirements: [
      'Lulusan Sarjana Kedokteran (Profesi Dokter / STR Aktif)',
      'Menguasai terminologi medis klinis & standar penulisan resep',
      'Sikap ramah, etis, dan profesional terhadap pasien VIP',
      'Mampu bekerja sama dalam tim instalasi rawat inap & ICU'
    ],
    salaryInfo: '$6,000 - $9,500 / Periode Gaji + Fasilitas Asuransi Medis',
    type: 'Residency',
    status: 'open',
    openDate: '2026-08-18'
  },
  {
    id: 'rec-3',
    hospitalId: 'nusawardenna',
    position: 'Forensic Medical Examiner & Crime Scene Investigator',
    department: 'Departemen Forensik & Mediko-Legal',
    description: 'Melakukan otopsi forensik, analisis trajektori luka tembak bersama penyidik resmi, serta menerbitkan laporan visum et repertum.',
    requirements: [
      'Pemahaman mendalam mengenai patologi forensik & balistik luka',
      'Ketelitian tinggi dalam pembuatan dokumen laporan investigasi',
      'Bersedia hadir sebagai saksi ahli di persidangan Pengadilan Kota'
    ],
    salaryInfo: '$8,000 - $12,000 / Periode Gaji',
    type: 'Full-Time',
    status: 'open',
    openDate: '2026-08-20'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    hospitalId: 'all',
    title: 'Protokol Respon Darurat Cuaca Buruk & Layanan Siaga 24 Jam',
    content: 'Sehubungan dengan peringatan badai tropis dari Badan Meteorologi San Andreas, seluruh unit IGD RS Nusawardenna dan MC Revenhill mengaktifkan Tim Reaksi Cepat dengan kesiapan ambulans segala medan.',
    category: 'Breaking Alert',
    priority: 'high',
    date: '2026-08-22',
    published: true,
    author: 'Direktorat Bersama Pelayanan Medis Kota'
  },
  {
    id: 'ann-2',
    hospitalId: 'nusawardenna',
    title: 'Pelaksanaan Donor Darah Massal Bersama Kepolisian & Damkar',
    content: 'RS Nusawardenna mengundang seluruh warga kota untuk berpartisipasi dalam program bakti donor darah di Lobby Utama. Setiap pendonor akan mendapatkan sertifikat kesehatan dan pemeriksaan gula darah gratis.',
    category: 'Event',
    priority: 'normal',
    date: '2026-08-21',
    published: true,
    author: 'Bagian Hubungan Masyarakat RS Nusawardenna'
  },
  {
    id: 'ann-3',
    hospitalId: 'revenhill',
    title: 'Peresmian Suite Baru MRI 3.0 Tesla Silent Scan di Revenhill',
    content: 'Medical Center Revenhill resmi meluncurkan teknologi imaging radiologi generasi terbaru dengan tingkat radiasi minimal dan akurasi diagnosa milimeter presisi tinggi.',
    category: 'News',
    priority: 'normal',
    date: '2026-08-19',
    published: true,
    author: 'Public Relations MC Revenhill'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-admin',
    userName: 'Chief Medical Administrator',
    userRole: 'ADMIN',
    action: 'SYSTEM_CONFIG_UPDATED',
    target: 'Hospital Status: RS Nusawardenna & MC Revenhill',
    timestamp: '2026-08-22 08:30:15',
    details: 'Status rumah sakit diset ke status "OPEN" dan mode siaga reguler.'
  },
  {
    id: 'log-2',
    userId: 'doc-1',
    userName: 'Dr. Raymond Vance',
    userRole: 'DOCTOR',
    action: 'APPOINTMENT_ACCEPTED',
    target: 'Appointment #NW-2026-8921 (Franklin Clinton)',
    timestamp: '2026-08-21 15:00:22',
    details: 'Janji temu disetujui untuk jadwal 23 Agustus 2026 pukul 10:00.'
  },
  {
    id: 'log-3',
    userId: 'doc-6',
    userName: 'Dr. Marcus Holloway',
    userRole: 'DOCTOR',
    action: 'PATIENT_RECORD_CREATED',
    target: 'Patient Record #REC-2026-001 (Trevor Philips)',
    timestamp: '2026-08-22 11:45:00',
    details: 'Rekam medis diagnosa fraktur rusuk berhasil diterbitkan.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Chief Medical Administrator',
    email: 'admin',
    password: 'admin',
    role: 'ADMIN',
    hospitalId: 'all',
    badgeNumber: 'HQ-ADMIN-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-vance',
    name: 'Dr. Raymond Vance',
    email: 'vance',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-1',
    badgeNumber: 'NW-MED-01',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-rostova',
    name: 'Dr. Elena Rostova',
    email: 'rostova',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-2',
    badgeNumber: 'NW-MED-12',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-sterling',
    name: 'Dr. Kimberly Sterling',
    email: 'sterling',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'revenhill',
    doctorId: 'doc-3',
    badgeNumber: 'RH-DIR-01',
    avatar: 'https://images.unsplash.com/photo-1594824813637-43f11075d94e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-sato',
    name: 'Dr. Kenji Sato',
    email: 'sato',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'revenhill',
    doctorId: 'doc-4',
    badgeNumber: 'RH-CARD-04',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-lin',
    name: 'Dr. Maya Lin',
    email: 'lin',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-5',
    badgeNumber: 'NW-FOR-08',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-doc-holloway',
    name: 'Dr. Marcus Holloway',
    email: 'holloway',
    password: '123',
    role: 'DOCTOR',
    hospitalId: 'nusawardenna',
    doctorId: 'doc-6',
    badgeNumber: 'NW-ORTH-03',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80'
  }
];
