import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Hospital,
  HospitalId,
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
  User
} from '../types';
import { StorageService } from '../services/storageService';

interface HospitalContextType {
  activeHospitalId: HospitalId;
  setActiveHospitalId: (id: HospitalId) => void;
  activeHospital: Hospital;
  hospitals: Record<string, Hospital>;
  services: Service[];
  doctors: Doctor[];
  appointments: Appointment[];
  patientRecords: PatientRecord[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  recruitment: RecruitmentPosition[];
  applications: RecruitmentApplication[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  users: User[];
  currentUser: User | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (role: 'ADMIN' | 'DOCTOR', doctorId?: string, customName?: string, directUser?: User) => void;
  logout: () => void;
  refreshData: () => void;

  // Actions
  updateHospital: (hospital: Hospital) => void;
  setEmergencyMode: (hospitalId: HospitalId, enabled: boolean, message: string) => void;
  setHospitalStatus: (hospitalId: HospitalId, status: 'OPEN' | 'BUSY' | 'FULL CAPACITY') => void;
  saveService: (service: Service) => void;
  deleteService: (id: string) => void;
  saveDoctor: (doctor: Doctor) => void;
  updateDoctorAvailability: (doctorId: string, availability: 'Available' | 'Busy' | 'Offline') => void;
  deleteDoctor: (id: string) => void;
  createAppointment: (data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], doctorNotes?: string) => void;
  createPatientRecord: (record: Omit<PatientRecord, 'id'>) => PatientRecord;
  saveGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  saveVideo: (video: VideoItem) => void;
  deleteVideo: (id: string) => void;
  saveRecruitmentPosition: (pos: RecruitmentPosition) => void;
  deleteRecruitmentPosition: (id: string) => void;
  submitApplication: (app: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>) => RecruitmentApplication;
  saveAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  saveUser: (user: User) => void;
  deleteUser: (id: string) => void;
  resetAllData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeHospitalId, setActiveHospitalIdState] = useState<HospitalId>(() => {
    return (localStorage.getItem('gta_rs_active_hospital_id') as HospitalId) || 'nusawardenna';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('gta_rs_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gta_rs_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Reactive state from StorageService
  const [hospitals, setHospitals] = useState<Record<string, Hospital>>(StorageService.getHospitals());
  const [services, setServices] = useState<Service[]>(StorageService.getServices());
  const [doctors, setDoctors] = useState<Doctor[]>(StorageService.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>(StorageService.getPatientRecords());
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [videos, setVideos] = useState<VideoItem[]>(StorageService.getVideos());
  const [recruitment, setRecruitment] = useState<RecruitmentPosition[]>(StorageService.getRecruitment());
  const [applications, setApplications] = useState<RecruitmentApplication[]>(StorageService.getApplications());
  const [announcements, setAnnouncements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());

  // Apply dark mode class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gta_rs_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setActiveHospitalId = (id: HospitalId) => {
    setActiveHospitalIdState(id);
    localStorage.setItem('gta_rs_active_hospital_id', id);
  };

  const refreshData = () => {
    setHospitals(StorageService.getHospitals());
    setServices(StorageService.getServices());
    setDoctors(StorageService.getDoctors());
    setAppointments(StorageService.getAppointments());
    setPatientRecords(StorageService.getPatientRecords());
    setGallery(StorageService.getGallery());
    setVideos(StorageService.getVideos());
    setRecruitment(StorageService.getRecruitment());
    setApplications(StorageService.getApplications());
    setAnnouncements(StorageService.getAnnouncements());
    setAuditLogs(StorageService.getAuditLogs());
    setUsers(StorageService.getUsers());
  };

  const login = (role: 'ADMIN' | 'DOCTOR', doctorId?: string, customName?: string, directUser?: User) => {
    let user: User;
    if (directUser) {
      user = directUser;
    } else if (role === 'ADMIN') {
      const existingAdmin = StorageService.getUsers().find(u => u.role === 'ADMIN');
      user = existingAdmin || {
        id: 'user-admin',
        name: customName || 'Chief Medical Administrator',
        email: 'admin',
        password: 'admin',
        role: 'ADMIN',
        hospitalId: 'all',
        badgeNumber: 'HQ-ADMIN-01',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
    } else {
      const doc = doctors.find(d => d.id === doctorId) || doctors[0];
      const existingDocUser = StorageService.getUsers().find(u => (doc && (u.doctorId === doc.id || u.email === doc.email)));
      user = existingDocUser || {
        id: `user-${doc?.id || 'doc'}`,
        name: doc?.name || 'Dokter Spesialis',
        email: doc?.email || doc?.id || 'dokter',
        password: '123',
        role: 'DOCTOR',
        hospitalId: doc?.hospitalId === 'both' ? 'all' : doc?.hospitalId,
        doctorId: doc?.id,
        badgeNumber: doc?.badgeNumber || 'NW-DOC-99',
        avatar: doc?.photo
      };
    }
    setCurrentUser(user);
    localStorage.setItem('gta_rs_current_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gta_rs_current_user');
  };

  // Actions
  const updateHospital = (hospital: Hospital) => {
    StorageService.updateHospital(hospital, currentUser || undefined);
    refreshData();
  };

  const setEmergencyMode = (hospitalId: HospitalId, enabled: boolean, message: string) => {
    StorageService.setEmergencyMode(hospitalId, enabled, message, currentUser || undefined);
    refreshData();
  };

  const setHospitalStatus = (hospitalId: HospitalId, status: 'OPEN' | 'BUSY' | 'FULL CAPACITY') => {
    StorageService.setHospitalStatus(hospitalId, status, currentUser || undefined);
    refreshData();
  };

  const saveService = (service: Service) => {
    StorageService.saveService(service, currentUser || undefined);
    refreshData();
  };

  const deleteService = (id: string) => {
    StorageService.deleteService(id, currentUser || undefined);
    refreshData();
  };

  const saveDoctor = (doctor: Doctor) => {
    StorageService.saveDoctor(doctor, currentUser || undefined);
    refreshData();
  };

  const updateDoctorAvailability = (doctorId: string, availability: 'Available' | 'Busy' | 'Offline') => {
    StorageService.updateDoctorAvailability(doctorId, availability, currentUser || undefined);
    refreshData();
  };

  const deleteDoctor = (id: string) => {
    StorageService.deleteDoctor(id, currentUser || undefined);
    refreshData();
  };

  const createAppointment = (data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const res = StorageService.createAppointment(data);
    refreshData();
    return res;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], doctorNotes?: string) => {
    StorageService.updateAppointmentStatus(id, status, doctorNotes, currentUser || undefined);
    refreshData();
  };

  const createPatientRecord = (record: Omit<PatientRecord, 'id'>) => {
    const res = StorageService.createPatientRecord(record, currentUser || undefined);
    refreshData();
    return res;
  };

  const saveGalleryItem = (item: GalleryItem) => {
    StorageService.saveGalleryItem(item, currentUser || undefined);
    refreshData();
  };

  const deleteGalleryItem = (id: string) => {
    StorageService.deleteGalleryItem(id, currentUser || undefined);
    refreshData();
  };

  const saveVideo = (video: VideoItem) => {
    StorageService.saveVideo(video, currentUser || undefined);
    refreshData();
  };

  const deleteVideo = (id: string) => {
    StorageService.deleteVideo(id, currentUser || undefined);
    refreshData();
  };

  const saveRecruitmentPosition = (pos: RecruitmentPosition) => {
    StorageService.saveRecruitmentPosition(pos, currentUser || undefined);
    refreshData();
  };

  const deleteRecruitmentPosition = (id: string) => {
    StorageService.deleteRecruitmentPosition(id, currentUser || undefined);
    refreshData();
  };

  const submitApplication = (app: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>) => {
    const res = StorageService.submitApplication(app);
    refreshData();
    return res;
  };

  const saveAnnouncement = (announcement: Announcement) => {
    StorageService.saveAnnouncement(announcement, currentUser || undefined);
    refreshData();
  };

  const deleteAnnouncement = (id: string) => {
    StorageService.deleteAnnouncement(id, currentUser || undefined);
    refreshData();
  };

  const saveUser = (user: User) => {
    StorageService.saveUser(user, currentUser || undefined);
    refreshData();
  };

  const deleteUser = (id: string) => {
    StorageService.deleteUser(id, currentUser || undefined);
    refreshData();
  };

  const resetAllData = () => {
    StorageService.resetToDefaults();
  };

  const activeHospital = hospitals[activeHospitalId] || hospitals.nusawardenna;

  return (
    <HospitalContext.Provider
      value={{
        activeHospitalId,
        setActiveHospitalId,
        activeHospital,
        hospitals,
        services,
        doctors,
        appointments,
        patientRecords,
        gallery,
        videos,
        recruitment,
        applications,
        announcements,
        auditLogs,
        users,
        currentUser,
        theme,
        toggleTheme,
        login,
        logout,
        refreshData,
        updateHospital,
        setEmergencyMode,
        setHospitalStatus,
        saveService,
        deleteService,
        saveDoctor,
        updateDoctorAvailability,
        deleteDoctor,
        createAppointment,
        updateAppointmentStatus,
        createPatientRecord,
        saveGalleryItem,
        deleteGalleryItem,
        saveVideo,
        deleteVideo,
        saveRecruitmentPosition,
        deleteRecruitmentPosition,
        submitApplication,
        saveAnnouncement,
        deleteAnnouncement,
        saveUser,
        deleteUser,
        resetAllData
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
