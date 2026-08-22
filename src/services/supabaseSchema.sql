-- ==========================================================
-- HOSPITAL HEALTHCARE MANAGEMENT SYSTEM - SUPABASE SQL SCHEMA
-- Target Database: PostgreSQL / Supabase
-- Covers: RS Nusawardenna & Medical Center Revenhill
-- ==========================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR')),
  hospital_id TEXT CHECK (hospital_id IN ('nusawardenna', 'revenhill', 'all')),
  doctor_id TEXT,
  badge_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  city_logo TEXT,
  description TEXT,
  history TEXT,
  vision JSONB DEFAULT '[]'::jsonb,
  mission JSONB DEFAULT '[]'::jsonb,
  director JSONB DEFAULT '{}'::jsonb,
  org_structure JSONB DEFAULT '[]'::jsonb,
  location JSONB DEFAULT '{}'::jsonb,
  contact JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'BUSY', 'FULL CAPACITY')),
  emergency_mode BOOLEAN DEFAULT FALSE,
  emergency_message TEXT,
  stats JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Activity',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  features JSONB DEFAULT '[]'::jsonb,
  operating_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  hospital_id TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  specialization TEXT NOT NULL,
  department TEXT NOT NULL,
  photo TEXT,
  bio TEXT,
  schedule TEXT,
  experience TEXT,
  availability TEXT DEFAULT 'Available' CHECK (availability IN ('Available', 'Busy', 'Offline')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  badge_number TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APPOINTMENTS TABLE (PUBLIC PATIENT BOOKING)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_dob DATE,
  patient_gender TEXT CHECK (patient_gender IN ('Laki-laki', 'Perempuan')),
  complaint TEXT NOT NULL,
  hospital_id TEXT NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Completed', 'Cancelled')),
  notes TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PATIENT MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.patient_records (
  id TEXT PRIMARY KEY,
  appointment_id TEXT REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  hospital_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  injury_type TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  prescriptions JSONB DEFAULT '[]'::jsonb,
  surgical_procedure TEXT,
  doctor_notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  hospital_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  hospital_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RECRUITMENT TABLE
CREATE TABLE IF NOT EXISTS public.recruitment (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  salary_info TEXT,
  type TEXT DEFAULT 'Full-Time',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  open_date DATE DEFAULT CURRENT_DATE
);

-- 10. RECRUITMENT APPLICATIONS
CREATE TABLE IF NOT EXISTS public.recruitment_applications (
  id TEXT PRIMARY KEY,
  position_id TEXT REFERENCES public.recruitment(id) ON DELETE CASCADE,
  position_title TEXT NOT NULL,
  hospital_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_discord TEXT NOT NULL,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Reviewed', 'Accepted', 'Rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  hospital_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  date DATE DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT TRUE,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published data and submit appointments
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public can view announcements" ON public.announcements FOR SELECT USING (published = true);
CREATE POLICY "Public can view recruitment" ON public.recruitment FOR SELECT USING (status = 'open');
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create applications" ON public.recruitment_applications FOR INSERT WITH CHECK (true);
