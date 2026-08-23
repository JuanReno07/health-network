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
import { supabase, isSupabaseConfigured } from './supabaseClient';

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

// Background sync helper to safely push updates to Supabase without blocking UI
async function cloudUpsert(table: string, data: any) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from(table).upsert(data);
  } catch (err) {
    console.warn(`Supabase upsert into ${table} notice:`, err);
  }
}

async function cloudDelete(table: string, id: string) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from(table).delete().eq('id', id);
  } catch (err) {
    console.warn(`Supabase delete from ${table} notice:`, err);
  }
}

export const StorageService = {
  // Cloud Initialization & Background Synchronization
  syncWithSupabase: async (): Promise<boolean> => {
    if (!isSupabaseConfigured() || !supabase) return false;

    try {
      // Sync Doctors
      const { data: remoteDoctors } = await supabase.from('doctors').select('*');
      if (remoteDoctors && remoteDoctors.length > 0) {
        save(KEYS.DOCTORS, remoteDoctors.map(d => ({
          ...d,
          hospitalId: d.hospital_id,
          badgeNumber: d.badge_number,
          availableDays: d.available_days || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
          availableTimeSlots: d.available_time_slots || ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
        })));
      }

      // Sync Appointments
      const { data: remoteAppointments } = await supabase.from('appointments').select('*');
      if (remoteAppointments && remoteAppointments.length > 0) {
        save(KEYS.APPOINTMENTS, remoteAppointments.map(a => ({
          ...a,
          patientName: a.patient_name,
          patientPhone: a.patient_phone,
          patientDob: a.patient_dob,
          patientGender: a.patient_gender,
          hospitalId: a.hospital_id,
          doctorId: a.doctor_id,
          doctorName: a.doctor_name,
          doctorNotes: a.doctor_notes,
          createdAt: a.created_at,
          updatedAt: a.updated_at
        })));
      }

      // Sync Users
      const { data: remoteUsers } = await supabase.from('users').select('*');
      if (remoteUsers && remoteUsers.length > 0) {
        save(KEYS.USERS, remoteUsers.map(u => ({
          ...u,
          hospitalId: u.hospital_id,
          doctorId: u.doctor_id,
          badgeNumber: u.badge_number
        })));
      }

      // Sync Announcements
      const { data: remoteAnnouncements } = await supabase.from('announcements').select('*');
      if (remoteAnnouncements && remoteAnnouncements.length > 0) {
        save(KEYS.ANNOUNCEMENTS, remoteAnnouncements.map(a => ({
          ...a,
          hospitalId: a.hospital_id
        })));
      }

      return true;
    } catch (e) {
      console.warn('Supabase sync background notice:', e);
      return false;
    }
  },

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
    
    // Async Cloud Sync
    cloudUpsert('hospitals', {
      id: hospital.id,
      name: hospital.name,
      short_name: hospital.shortName,
      tagline: hospital.tagline,
      description: hospital.description,
      address: hospital.location?.address || '',
      hotline: hospital.contact?.emergencyPhone || '',
      dispatch_code: hospital.contact?.radioFrequency || '',
      logo_path: hospital.logo,
      emergency_mode: hospital.emergencyMode,
      emergency_message: hospital.emergencyMessage,
      status: hospital.status
    });

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

      cloudUpsert('hospitals', {
        id: hospitalId,
        emergency_mode: enabled,
        emergency_message: message
      });

      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: enabled ? 'EMERGENCY_MODE_ACTIVATED' : 'EMERGENCY_MODE_DEACTIVATED',
        target: hospitals[hospitalId].name,
        timestamp: new Date().toLocaleString('id-ID'),
        details: enabled ? `Status Darurat Diaktifkan: ${message}` : 'Status Darurat Dicabut.'
      });
    }
  },

  setHospitalStatus: (hospitalId: HospitalId, status: 'OPEN' | 'BUSY' | 'FULL CAPACITY', user?: User): void => {
    const hospitals = StorageService.getHospitals();
    if (hospitals[hospitalId]) {
      hospitals[hospitalId].status = status;
      save(KEYS.HOSPITALS, hospitals);

      cloudUpsert('hospitals', {
        id: hospitalId,
        status: status
      });

      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'HOSPITAL_STATUS_CHANGED',
        target: `${hospitals[hospitalId].name} (${status})`,
        timestamp: new Date().toLocaleString('id-ID')
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

    cloudUpsert('services', {
      id: service.id,
      hospital_id: service.hospitalId,
      title: service.title,
      category: service.category,
      description: service.description,
      icon: service.icon,
      status: service.status,
      features: service.features,
      operating_hours: service.operatingHours
    });

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
    cloudDelete('services', id);

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
    return load(KEYS.DOCTORS, INITIAL_DOCTORS);
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

    cloudUpsert('doctors', {
      id: doctor.id,
      hospital_id: doctor.hospitalId,
      name: doctor.name,
      title: doctor.title,
      specialization: doctor.specialization,
      department: doctor.department,
      photo: doctor.photo,
      bio: doctor.bio,
      schedule: doctor.schedule,
      available_days: doctor.availableDays,
      available_time_slots: doctor.availableTimeSlots,
      experience: doctor.experience,
      availability: doctor.availability,
      status: doctor.status,
      badge_number: doctor.badgeNumber,
      phone: doctor.phone,
      email: doctor.email
    });

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'DOCTOR_UPDATED' : 'DOCTOR_ADDED',
      target: doctor.name,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  updateDoctorAvailability: (doctorId: string, availability: 'Available' | 'Busy' | 'Offline', user?: User): void => {
    const doctors = StorageService.getDoctors();
    const target = doctors.find(d => d.id === doctorId);
    if (target) {
      target.availability = availability;
      save(KEYS.DOCTORS, doctors);

      cloudUpsert('doctors', {
        id: doctorId,
        availability: availability
      });

      StorageService.addAuditLog({
        userId: user?.id || doctorId,
        userName: user?.name || target.name,
        userRole: user?.role || 'DOCTOR',
        action: 'DOCTOR_DUTY_STATUS_CHANGED',
        target: `${target.name} (${availability})`,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  deleteDoctor: (id: string, user?: User): void => {
    const doctors = StorageService.getDoctors();
    const target = doctors.find(d => d.id === id);
    const updated = doctors.filter(d => d.id !== id);
    save(KEYS.DOCTORS, updated);
    cloudDelete('doctors', id);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'DOCTOR_DELETED',
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
    const id = `APT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...data,
      id,
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };
    appointments.unshift(newAppointment);
    save(KEYS.APPOINTMENTS, appointments);

    cloudUpsert('appointments', {
      id: newAppointment.id,
      patient_name: newAppointment.patientName,
      patient_phone: newAppointment.patientPhone,
      patient_dob: newAppointment.patientDob,
      patient_gender: newAppointment.patientGender,
      complaint: newAppointment.complaint,
      hospital_id: newAppointment.hospitalId,
      doctor_id: newAppointment.doctorId,
      doctor_name: newAppointment.doctorName,
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status,
      notes: newAppointment.notes,
      created_at: newAppointment.createdAt,
      updated_at: newAppointment.updatedAt
    });

    StorageService.addAuditLog({
      userId: 'public-system',
      userName: 'Public Booking Portal',
      userRole: 'ADMIN',
      action: 'APPOINTMENT_REQUESTED',
      target: `${newAppointment.patientName} (${newAppointment.id})`,
      timestamp: new Date().toLocaleString('id-ID'),
      details: `Pendaftaran janji temu dengan ${newAppointment.doctorName} pada tanggal ${newAppointment.date} pukul ${newAppointment.time}.`
    });

    return newAppointment;
  },

  updateAppointmentStatus: (id: string, status: Appointment['status'], doctorNotes?: string, user?: User): void => {
    const appointments = StorageService.getAppointments();
    const target = appointments.find(a => a.id === id);
    if (target) {
      target.status = status;
      if (doctorNotes !== undefined) target.doctorNotes = doctorNotes;
      target.updatedAt = new Date().toISOString();
      save(KEYS.APPOINTMENTS, appointments);

      cloudUpsert('appointments', {
        id: id,
        status: status,
        doctor_notes: target.doctorNotes,
        updated_at: target.updatedAt
      });

      StorageService.addAuditLog({
        userId: user?.id || 'doctor',
        userName: user?.name || 'Dokter Pemeriksa',
        userRole: user?.role || 'DOCTOR',
        action: 'APPOINTMENT_STATUS_UPDATED',
        target: `${target.patientName} -> ${status}`,
        timestamp: new Date().toLocaleString('id-ID'),
        details: doctorNotes ? `Catatan dokter: ${doctorNotes}` : undefined
      });
    }
  },

  // Patient Records
  getPatientRecords: (): PatientRecord[] => {
    return load(KEYS.PATIENT_RECORDS, INITIAL_PATIENT_RECORDS);
  },

  createPatientRecord: (record: Omit<PatientRecord, 'id'>, user?: User): PatientRecord => {
    const records = StorageService.getPatientRecords();
    const id = `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: PatientRecord = { ...record, id };
    records.unshift(newRecord);
    save(KEYS.PATIENT_RECORDS, records);

    cloudUpsert('patient_records', {
      id: newRecord.id,
      appointment_id: newRecord.appointmentId,
      patient_name: newRecord.patientName,
      patient_phone: newRecord.patientPhone,
      hospital_id: newRecord.hospitalId,
      doctor_id: newRecord.doctorId,
      doctor_name: newRecord.doctorName,
      injury_type: newRecord.injuryType,
      diagnosis: newRecord.diagnosis,
      treatment: newRecord.treatment,
      prescriptions: newRecord.prescriptions,
      surgical_procedure: newRecord.surgicalProcedure,
      doctor_notes: newRecord.doctorNotes,
      date: newRecord.date
    });

    StorageService.addAuditLog({
      userId: user?.id || newRecord.doctorId,
      userName: user?.name || newRecord.doctorName,
      userRole: user?.role || 'DOCTOR',
      action: 'PATIENT_MEDICAL_RECORD_CREATED',
      target: `${newRecord.patientName} (${newRecord.id})`,
      timestamp: new Date().toLocaleString('id-ID'),
      details: `Diagnosis: ${newRecord.diagnosis} | Tindakan: ${newRecord.treatment}`
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

    cloudUpsert('gallery', item);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'GALLERY_IMAGE_UPDATED' : 'GALLERY_IMAGE_ADDED',
      target: item.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteGalleryItem: (id: string, user?: User): void => {
    const gallery = StorageService.getGallery();
    const target = gallery.find(g => g.id === id);
    const updated = gallery.filter(g => g.id !== id);
    save(KEYS.GALLERY, updated);
    cloudDelete('gallery', id);

    if (target) {
      StorageService.addAuditLog({
        userId: user?.id || 'admin',
        userName: user?.name || 'Administrator',
        userRole: user?.role || 'ADMIN',
        action: 'GALLERY_IMAGE_DELETED',
        target: target.title,
        timestamp: new Date().toLocaleString('id-ID')
      });
    }
  },

  // Videos
  getVideos: (): VideoItem[] => {
    const videos = load<VideoItem[]>(KEYS.VIDEOS, INITIAL_VIDEOS);
    return videos.map(v => ({
      ...v,
      url: formatYouTubeEmbedUrl(v.url)
    }));
  },

  saveVideo: (video: VideoItem, user?: User): void => {
    const videos = StorageService.getVideos();
    const sanitizedVideo: VideoItem = {
      ...video,
      url: formatYouTubeEmbedUrl(video.url)
    };

    const existingIndex = videos.findIndex(v => v.id === sanitizedVideo.id);
    if (existingIndex >= 0) {
      videos[existingIndex] = sanitizedVideo;
    } else {
      videos.unshift(sanitizedVideo);
    }
    save(KEYS.VIDEOS, videos);

    cloudUpsert('videos', sanitizedVideo);

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'VIDEO_UPDATED' : 'VIDEO_ADDED',
      target: sanitizedVideo.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteVideo: (id: string, user?: User): void => {
    const videos = StorageService.getVideos();
    const target = videos.find(v => v.id === id);
    const updated = videos.filter(v => v.id !== id);
    save(KEYS.VIDEOS, updated);
    cloudDelete('videos', id);

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

  saveRecruitmentPosition: (pos: RecruitmentPosition, user?: User): void => {
    const positions = StorageService.getRecruitment();
    const existingIndex = positions.findIndex(p => p.id === pos.id);
    if (existingIndex >= 0) {
      positions[existingIndex] = pos;
    } else {
      positions.unshift(pos);
    }
    save(KEYS.RECRUITMENT, positions);

    cloudUpsert('recruitment_positions', {
      id: pos.id,
      hospital_id: pos.hospitalId,
      position: pos.position,
      department: pos.department,
      description: pos.description,
      requirements: pos.requirements,
      salary_info: pos.salaryInfo,
      type: pos.type,
      status: pos.status,
      open_date: pos.openDate
    });

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'RECRUITMENT_POSITION_UPDATED' : 'RECRUITMENT_POSITION_CREATED',
      target: pos.position,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteRecruitmentPosition: (id: string, user?: User): void => {
    const positions = StorageService.getRecruitment();
    const target = positions.find(p => p.id === id);
    const updated = positions.filter(p => p.id !== id);
    save(KEYS.RECRUITMENT, updated);
    cloudDelete('recruitment_positions', id);

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

    cloudUpsert('recruitment_applications', {
      id: newApp.id,
      position_id: newApp.positionId,
      position_title: newApp.positionTitle,
      hospital_id: newApp.hospitalId,
      applicant_name: newApp.applicantName,
      applicant_phone: newApp.applicantPhone,
      applicant_discord: newApp.applicantDiscord,
      experience: newApp.experience,
      motivation: newApp.motivation,
      status: newApp.status
    });

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

    cloudUpsert('announcements', {
      id: announcement.id,
      hospital_id: announcement.hospitalId,
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      date: announcement.date,
      published: announcement.published,
      author: announcement.author
    });

    StorageService.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'ADMIN',
      action: existingIndex >= 0 ? 'ANNOUNCEMENT_UPDATED' : 'ANNOUNCEMENT_CREATED',
      target: announcement.title,
      timestamp: new Date().toLocaleString('id-ID')
    });
  },

  deleteAnnouncement: (id: string, user?: User): void => {
    const announcements = StorageService.getAnnouncements();
    const target = announcements.find(a => a.id === id);
    const updated = announcements.filter(a => a.id !== id);
    save(KEYS.ANNOUNCEMENTS, updated);
    cloudDelete('announcements', id);

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
    if (logs.length > 100) logs.pop();
    save(KEYS.AUDIT_LOGS, logs);

    cloudUpsert('audit_logs', {
      id: newLog.id,
      user_id: newLog.userId,
      user_name: newLog.userName,
      user_role: newLog.userRole,
      action: newLog.action,
      target: newLog.target,
      timestamp: newLog.timestamp,
      details: newLog.details
    });
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

    cloudUpsert('users', {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password || '123',
      role: user.role,
      hospital_id: user.hospitalId,
      doctor_id: user.doctorId,
      badge_number: user.badgeNumber,
      avatar: user.avatar
    });

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
    cloudDelete('users', id);

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
