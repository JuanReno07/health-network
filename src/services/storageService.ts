import {
  Hospital,
  Service,
  Doctor,
  Appointment,
  PatientRecord,
  GalleryItem,
  VideoItem,
  RecruitmentPosition,
  RecruitmentApplication,
  Announcement,
  AuditLog,
  User,
  HospitalId
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_SERVICES,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PATIENT_RECORDS,
  INITIAL_GALLERY,
  INITIAL_VIDEOS,
  INITIAL_RECRUITMENT,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS
} from '../data/mockData';
import { formatYouTubeEmbedUrl } from '../utils/youtube';

const KEYS = {
  HOSPITALS: 'gta_rs_hospitals',
  SERVICES: 'gta_rs_services',
  DOCTORS: 'gta_rs_doctors',
  APPOINTMENTS: 'gta_rs_appointments',
  PATIENT_RECORDS: 'gta_rs_patient_records',
  GALLERY: 'gta_rs_gallery',
  VIDEOS: 'gta_rs_videos',
  RECRUITMENT: 'gta_rs_recruitment',
  APPLICATIONS: 'gta_rs_applications',
  ANNOUNCEMENTS: 'gta_rs_announcements',
  AUDIT_LOGS: 'gta_rs_audit_logs',
  USERS: 'gta_rs_users',
  ACTIVE_HOSPITAL: 'gta_rs_active_hospital_id'
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

export const StorageService = {
  // Hospitals
  getHospitals: (): Record<string, Hospital> => {
    const data = load<Record<string, Hospital>>(KEYS.HOSPITALS, INITIAL_HOSPITALS);
    if (data.nusawardenna) {
      data.nusawardenna.logo = '/logo/logo-nusawardenna.png';
      data.nusawardenna.cityLogo = '/logo/logo-kota.png';
    }
    if (data.revenhill) {
      data.revenhill.logo = '/logo/logo-revenhill.png';
      data.revenhill.cityLogo = '/logo/logo-kota.png';
    }
    return data;
  },

  updateHospital: (hospital: Hospital, user?: User): void => {
    const hospitals = StorageService.getHospitals();
    hospitals[hospital.id] = hospital;
    save(KEYS.HOSPITALS, hospitals);
    
    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: 'HOSPITAL_PROFILE_UPDATED',
      target: hospital.name,
      timestamp: new Date().toLocaleString('id-ID'),
      details: `Memperbarui profil rumah sakit & konfigurasi operasional.`
    });
  },

  setEmergencyMode: (hospitalId: HospitalId, enabled: boolean, message: string, user?: User): void => {
    const hospitals = StorageService.getHospitals();
    if (hospitals[hospitalId]) {
      hospitals[hospitalId].emergencyMode = enabled;
      hospitals[hospitalId].emergencyMessage = message;
      save(KEYS.HOSPITALS, hospitals);

      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: enabled ? 'EMERGENCY_MODE_ACTIVATED' : 'EMERGENCY_MODE_DEACTIVATED',
        target: hospitals[hospitalId].name,
        timestamp: new Date().toLocaleString('id-ID'),
        details: enabled ? `Mengaktifkan status Darurat: "${message}"` : 'Menonaktifkan status Darurat.'
      });
    }
  },

  setHospitalStatus: (hospitalId: HospitalId, status: 'OPEN' | 'BUSY' | 'FULL CAPACITY', user?: User): void => {
    const hospitals = StorageService.getHospitals();
    if (hospitals[hospitalId]) {
      hospitals[hospitalId].status = status;
      save(KEYS.HOSPITALS, hospitals);

      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'HOSPITAL_STATUS_CHANGED',
        target: `${hospitals[hospitalId].name} -> ${status}`,
        timestamp: new Date().toLocaleString('id-ID'),
        details: `Mengubah status operasional menjadi ${status}.`
      });
    }
  },

  // Services
  getServices: (): Service[] => {
    return load(KEYS.SERVICES, INITIAL_SERVICES);
  },

  saveService: (service: Service, user?: User): void => {
    const services = StorageService.getServices();
    const existingIndex = services.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    save(KEYS.SERVICES, services);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'SERVICE_UPDATED' : 'SERVICE_CREATED',
      target: service.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteService: (id: string, user?: User): void => {
    const services = StorageService.getServices();
    const target = services.find(s => s.id === id);
    const updated = services.filter(s => s.id !== id);
    save(KEYS.SERVICES, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'SERVICE_DELETED',
        target: target.title,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Doctors
  getDoctors: (): Doctor[] => {
    const list = load<Doctor[]>(KEYS.DOCTORS, INITIAL_DOCTORS);
    return list.map(d => {
      const initialMatch = INITIAL_DOCTORS.find(i => i.id === d.id);
      return {
        ...d,
        availableDays: d.availableDays || initialMatch?.availableDays || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
        availableTimeSlots: d.availableTimeSlots || initialMatch?.availableTimeSlots || ['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30']
      };
    });
  },

  saveDoctor: (doctor: Doctor, user?: User): void => {
    const doctors = StorageService.getDoctors();
    const existingIndex = doctors.findIndex(d => d.id === doctor.id);
    if (existingIndex >= 0) {
      doctors[existingIndex] = doctor;
    } else {
      doctors.push(doctor);
    }
    save(KEYS.DOCTORS, doctors);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'DOCTOR_PROFILE_UPDATED' : 'DOCTOR_ADDED',
      target: doctor.name,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  updateDoctorAvailability: (doctorId: string, availability: 'Available' | 'Busy' | 'Offline', user?: User): void => {
    const doctors = StorageService.getDoctors();
    const doc = doctors.find(d => d.id === doctorId);
    if (doc) {
      doc.availability = availability;
      save(KEYS.DOCTORS, doctors);

      StorageService.addAuditLog({
        userId: user?.id || doctorId,
        userName: user?.name || doc.name,
        userRole: user?.role || 'DOCTOR',
        action: 'DOCTOR_AVAILABILITY_CHANGED',
        target: `${doc.name} -> ${availability}`,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  deleteDoctor: (id: string, user?: User): void => {
    const doctors = StorageService.getDoctors();
    const target = doctors.find(d => d.id === id);
    const updated = doctors.filter(d => d.id !== id);
    save(KEYS.DOCTORS, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'DOCTOR_REMOVED',
        target: target.name,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Appointments
  getAppointments: (): Appointment[] => {
    return load(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  createAppointment: (data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Appointment => {
    const appointments = StorageService.getAppointments();
    const prefix = data.hospitalId === 'nusawardenna' ? 'NW' : 'RH';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const id = `${prefix}-${year}-${randomNum}`;
    const now = new Date().toLocaleString('id-ID');

    // Get doctor name if not provided
    const doctors = StorageService.getDoctors();
    const assignedDoc = doctors.find(d => d.id === data.doctorId);

    const newAppointment: Appointment = {
      ...data,
      id,
      doctorName: assignedDoc?.name || 'Dokter Spesialis Siaga',
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };

    appointments.unshift(newAppointment);
    save(KEYS.APPOINTMENTS, appointments);

    StorageService.addAuditLog({
      userId: 'public-patient',
      userName: data.patientName,
      userRole: 'ADMIN',
      action: 'APPOINTMENT_SUBMITTED',
      target: `${id} (${data.patientName})`,
      timestamp: now,
      details: `Pendaftaran janji temu baru di ${data.hospitalId === 'nusawardenna' ? 'RS Nusawardenna' : 'MC Revenhill'}.`
    });

    return newAppointment;
  },

  updateAppointmentStatus: (
    id: string,
    status: Appointment['status'],
    doctorNotes?: string,
    user?: User
  ): void => {
    const appointments = StorageService.getAppointments();
    const target = appointments.find(a => a.id === id);
    if (target) {
      target.status = status;
      if (doctorNotes !== undefined) {
        target.doctorNotes = doctorNotes;
      }
      target.updatedAt = new Date().toLocaleString('id-ID');
      save(KEYS.APPOINTMENTS, appointments);

      StorageService.addAuditLog({
        userId: user?.id || 'staff',
        userName: user?.name || 'Staff Medis',
        userRole: user?.role || 'DOCTOR',
        action: `APPOINTMENT_${status.toUpperCase()}`,
        target: `${id} (${target.patientName})`,
        timestamp: new Date().toLocaleString('id-ID'),
        details: doctorNotes ? `Catatan: ${doctorNotes}` : undefined
      });
    }
  },

  // Patient Medical Records
  getPatientRecords: (): PatientRecord[] => {
    return load(KEYS.PATIENT_RECORDS, INITIAL_PATIENT_RECORDS);
  },

  createPatientRecord: (record: Omit<PatientRecord, 'id'>, user?: User): PatientRecord => {
    const records = StorageService.getPatientRecords();
    const id = `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: PatientRecord = {
      ...record,
      id
    };
    records.unshift(newRecord);
    save(KEYS.PATIENT_RECORDS, records);

    StorageService.addAuditLog({
      userId: user?.id || record.doctorId,
      userName: user?.name || record.doctorName,
      userRole: user?.role || 'DOCTOR',
      action: 'PATIENT_RECORD_CREATED',
      target: `${id} - ${record.patientName} (${record.injuryType})`,
      timestamp: new Date().toLocaleString('id-ID'),
      details: `Diagnosa: ${record.diagnosis}`
    });

    return newRecord;
  },

  // Gallery
  getGallery: (): GalleryItem[] => {
    return load(KEYS.GALLERY, INITIAL_GALLERY);
  },

  saveGalleryItem: (item: GalleryItem, user?: User): void => {
    const gallery = StorageService.getGallery();
    const existingIndex = gallery.findIndex(g => g.id === item.id);
    if (existingIndex >= 0) {
      gallery[existingIndex] = item;
    } else {
      gallery.unshift(item);
    }
    save(KEYS.GALLERY, gallery);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'GALLERY_ITEM_UPDATED' : 'GALLERY_ITEM_ADDED',
      target: item.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteGalleryItem: (id: string, user?: User): void => {
    const gallery = StorageService.getGallery();
    const target = gallery.find(g => g.id === id);
    const updated = gallery.filter(g => g.id !== id);
    save(KEYS.GALLERY, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'GALLERY_ITEM_DELETED',
        target: target.title,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Videos
  getVideos: (): VideoItem[] => {
    const list = load(KEYS.VIDEOS, INITIAL_VIDEOS);
    return list.map((v: VideoItem) => ({
      ...v,
      url: formatYouTubeEmbedUrl(v.url, false)
    }));
  },

  saveVideo: (video: VideoItem, user?: User): void => {
    const formattedVideo: VideoItem = {
      ...video,
      url: formatYouTubeEmbedUrl(video.url, false)
    };
    const videos = StorageService.getVideos();
    const existingIndex = videos.findIndex(v => v.id === formattedVideo.id);
    if (existingIndex >= 0) {
      videos[existingIndex] = formattedVideo;
    } else {
      videos.unshift(formattedVideo);
    }
    save(KEYS.VIDEOS, videos);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'VIDEO_UPDATED' : 'VIDEO_ADDED',
      target: formattedVideo.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteVideo: (id: string, user?: User): void => {
    const videos = StorageService.getVideos();
    const target = videos.find(v => v.id === id);
    const updated = videos.filter(v => v.id !== id);
    save(KEYS.VIDEOS, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'VIDEO_DELETED',
        target: target.title,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Recruitment
  getRecruitment: (): RecruitmentPosition[] => {
    return load(KEYS.RECRUITMENT, INITIAL_RECRUITMENT);
  },

  saveRecruitmentPosition: (position: RecruitmentPosition, user?: User): void => {
    const positions = StorageService.getRecruitment();
    const existingIndex = positions.findIndex(p => p.id === position.id);
    if (existingIndex >= 0) {
      positions[existingIndex] = position;
    } else {
      positions.unshift(position);
    }
    save(KEYS.RECRUITMENT, positions);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'RECRUITMENT_POSITION_UPDATED' : 'RECRUITMENT_POSITION_CREATED',
      target: position.position,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteRecruitmentPosition: (id: string, user?: User): void => {
    const positions = StorageService.getRecruitment();
    const target = positions.find(p => p.id === id);
    const updated = positions.filter(p => p.id !== id);
    save(KEYS.RECRUITMENT, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'RECRUITMENT_POSITION_DELETED',
        target: target.position,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  getApplications: (): RecruitmentApplication[] => {
    return load(KEYS.APPLICATIONS, []);
  },

  submitApplication: (app: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>): RecruitmentApplication => {
    const apps = StorageService.getApplications();
    const id = `APP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newApp: RecruitmentApplication = {
      ...app,
      id,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString('id-ID')
    };
    apps.unshift(newApp);
    save(KEYS.APPLICATIONS, apps);

    StorageService.addAuditLog({
      userId: 'applicant',
      userName: app.applicantName,
      userRole: 'ADMIN',
      action: 'RECRUITMENT_APPLICATION_SUBMITTED',
      target: `${app.positionTitle} (${app.applicantName})`,
      timestamp: new Date().toLocaleString('id-ID')
    });

    return newApp;
  },

  // Announcements
  getAnnouncements: (): Announcement[] => {
    return load(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  saveAnnouncement: (announcement: Announcement, user?: User): void => {
    const announcements = StorageService.getAnnouncements();
    const existingIndex = announcements.findIndex(a => a.id === announcement.id);
    if (existingIndex >= 0) {
      announcements[existingIndex] = announcement;
    } else {
      announcements.unshift(announcement);
    }
    save(KEYS.ANNOUNCEMENTS, announcements);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'ANNOUNCEMENT_UPDATED' : 'ANNOUNCEMENT_PUBLISHED',
      target: announcement.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteAnnouncement: (id: string, user?: User): void => {
    const announcements = StorageService.getAnnouncements();
    const target = announcements.find(a => a.id === id);
    const updated = announcements.filter(a => a.id !== id);
    save(KEYS.ANNOUNCEMENTS, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'ANNOUNCEMENT_DELETED',
        target: target.title,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return load(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog: (log: Omit<AuditLog, 'id'>): void => {
    const logs = StorageService.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    if (logs.length > 100) logs.pop();
    save(KEYS.AUDIT_LOGS, logs);
  },

  // Users
  getUsers: (): User[] => {
    return load(KEYS.USERS, INITIAL_USERS);
  },

  saveUser: (user: User, adminUser?: User): void => {
    const users = StorageService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    save(KEYS.USERS, users);

    StorageService.addAuditLog({
      userId: adminUser?.id || 'admin',
      userName: adminUser?.name || 'Administrator',
      userRole: 'ADMIN',
      action: existingIndex >= 0 ? 'USER_ACCOUNT_UPDATED' : 'USER_ACCOUNT_CREATED',
      target: `${user.name} (${user.role})`,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteUser: (id: string, adminUser?: User): void => {
    const users = StorageService.getUsers();
    const target = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    save(KEYS.USERS, updated);

    if (target) {
      StorageService.addAuditLog({
        userId: adminUser?.id || 'admin',
        userName: adminUser?.name || 'Administrator',
        userRole: 'ADMIN',
        action: 'USER_ACCOUNT_DELETED',
        target: `${target.name} (${target.role})`,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Reset to default seed
  resetToDefaults: (): void => {
    localStorage.clear();
    window.location.reload();
  }
};
