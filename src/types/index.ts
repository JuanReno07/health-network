export type HospitalId = 'nusawardenna' | 'revenhill';

export interface LocationInfo {
  address: string;
  district: string;
  coordinates: string;
  mapPreviewUrl?: string;
}

export interface ContactInfo {
  phone: string;
  emergencyPhone: string;
  radioFrequency: string;
  email: string;
  discordServer?: string;
  instagram?: string;
  operatingHours: string;
}

export interface DirectorInfo {
  name: string;
  title: string;
  photo: string;
  message: string;
}

export interface OrgMember {
  id: string;
  department: string;
  name: string;
  role: string;
  badge?: string;
}

export interface Hospital {
  id: HospitalId;
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  cityLogo: string;
  description: string;
  history: string;
  vision: string[];
  mission: string[];
  director: DirectorInfo;
  orgStructure: OrgMember[];
  location: LocationInfo;
  contact: ContactInfo;
  status: 'OPEN' | 'BUSY' | 'FULL CAPACITY';
  emergencyMode: boolean;
  emergencyMessage: string;
  stats: {
    patientsServed: number;
    staffCount: number;
    satisfactionRate: number;
    emergencyResponseTime: string;
  };
}

export interface Service {
  id: string;
  hospitalId: HospitalId | 'all';
  title: string;
  category: 'Emergency' | 'Inpatient' | 'Surgery' | 'Outpatient' | 'Diagnostic' | 'Support';
  description: string;
  icon: string;
  status: 'active' | 'disabled';
  features: string[];
  operatingHours: string;
}

export interface Doctor {
  id: string;
  userId?: string;
  hospitalId: HospitalId | 'both';
  name: string;
  title: string;
  specialization: string;
  department: string;
  photo: string;
  bio: string;
  schedule: string;
  availableDays?: string[]; // e.g. ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
  availableTimeSlots?: string[]; // e.g. ['08:30', '09:30', '10:30', '11:30', '13:30', '14:30']
  experience: string;
  availability: 'Available' | 'Busy' | 'Offline';
  status: 'active' | 'disabled';
  phone?: string;
  email?: string;
  badgeNumber?: string;
}

export type AppointmentStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientDob: string;
  patientGender: 'Laki-laki' | 'Perempuan';
  complaint: string;
  hospitalId: HospitalId;
  doctorId: string;
  doctorName?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRecord {
  id: string;
  appointmentId?: string;
  patientName: string;
  patientPhone: string;
  hospitalId: HospitalId;
  doctorId: string;
  doctorName: string;
  injuryType: 'Gunshot Wound (GSW)' | 'Blunt Force Trauma' | 'Laceration / Stab' | 'Fracture' | 'Burn' | 'Internal Bleeding' | 'Tox / Overdose' | 'General Illness' | 'Routine Checkup';
  diagnosis: string;
  treatment: string;
  prescriptions: string[];
  surgicalProcedure?: string;
  doctorNotes: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  hospitalId: HospitalId | 'all';
  title: string;
  category: 'Facilities' | 'Ambulance & EMS' | 'Surgical Theatres' | 'Medical Staff' | 'Events';
  imageUrl: string;
  description: string;
  date: string;
}

export interface VideoItem {
  id: string;
  hospitalId: HospitalId | 'all';
  title: string;
  type: 'Trailer' | 'Profile' | 'Education' | 'Event';
  url: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
}

export interface RecruitmentPosition {
  id: string;
  hospitalId: HospitalId | 'all';
  position: string;
  department: string;
  description: string;
  requirements: string[];
  salaryInfo: string;
  type: 'Full-Time' | 'Part-Time' | 'Residency' | 'Paramedic';
  status: 'open' | 'closed';
  openDate: string;
}

export interface RecruitmentApplication {
  id: string;
  positionId: string;
  positionTitle: string;
  hospitalId: HospitalId;
  applicantName: string;
  applicantPhone: string;
  applicantDiscord: string;
  experience: string;
  motivation: string;
  status: 'Submitted' | 'Reviewed' | 'Accepted' | 'Rejected';
  submittedAt: string;
}

export interface Announcement {
  id: string;
  hospitalId: HospitalId | 'all';
  title: string;
  content: string;
  category: 'Breaking Alert' | 'News' | 'Notice' | 'Event';
  priority: 'high' | 'normal';
  date: string;
  published: boolean;
  author: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'ADMIN' | 'DOCTOR';
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface User {
  id: string;
  name: string;
  email: string; // Used as Username / ID Login or Email
  password?: string;
  role: 'ADMIN' | 'DOCTOR';
  hospitalId?: HospitalId | 'all';
  doctorId?: string;
  avatar?: string;
  badgeNumber?: string;
}
