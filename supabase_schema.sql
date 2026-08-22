-- ==============================================================================
-- GTA SAN ANDREAS HEALTHCARE NETWORK - SUPABASE DATABASE SCHEMA
-- RS Nusawardenna & Medical Center Revenhill
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Existing Tables (Optional if resetting)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS recruitment_applications CASCADE;
DROP TABLE IF EXISTS recruitment_positions CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS patient_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==============================================================================
-- 3. TABLES CREATION
-- ==============================================================================

-- HOSPITALS TABLE
CREATE TABLE hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    address TEXT,
    hotline TEXT,
    dispatch_code TEXT,
    logo_path TEXT,
    primary_color TEXT,
    emergency_mode BOOLEAN DEFAULT FALSE,
    emergency_message TEXT,
    status TEXT DEFAULT 'OPEN',
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    features JSONB DEFAULT '[]'::jsonb,
    operating_hours TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCTORS TABLE
CREATE TABLE doctors (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialization TEXT NOT NULL,
    department TEXT NOT NULL,
    photo TEXT,
    bio TEXT,
    schedule TEXT,
    available_days JSONB DEFAULT '["Senin","Selasa","Rabu","Kamis","Jumat"]'::jsonb,
    available_time_slots JSONB DEFAULT '["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]'::jsonb,
    experience TEXT,
    availability TEXT DEFAULT 'Available',
    status TEXT DEFAULT 'active',
    badge_number TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_dob TEXT,
    patient_gender TEXT,
    complaint TEXT NOT NULL,
    hospital_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    notes TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PATIENT RECORDS TABLE
CREATE TABLE patient_records (
    id TEXT PRIMARY KEY,
    appointment_id TEXT,
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
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY TABLE
CREATE TABLE gallery (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIDEOS TABLE
CREATE TABLE videos (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECRUITMENT POSITIONS TABLE
CREATE TABLE recruitment_positions (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb,
    salary_info TEXT,
    type TEXT DEFAULT 'Full-Time',
    status TEXT DEFAULT 'open',
    open_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECRUITMENT APPLICATIONS TABLE
CREATE TABLE recruitment_applications (
    id TEXT PRIMARY KEY,
    position_id TEXT NOT NULL,
    position_title TEXT NOT NULL,
    hospital_id TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_discord TEXT,
    experience TEXT,
    motivation TEXT,
    status TEXT DEFAULT 'Submitted',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    date TEXT NOT NULL,
    published BOOLEAN DEFAULT TRUE,
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS TABLE (AUTHENTICATION & ROLES)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, -- Holds username / ID login
    password TEXT NOT NULL DEFAULT '123',
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR')),
    hospital_id TEXT DEFAULT 'all',
    doctor_id TEXT,
    badge_number TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow Public READ access to public data
CREATE POLICY "Public can view hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Public can view active doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public can view recruitment" ON recruitment_positions FOR SELECT USING (true);
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public can check appointments by ID" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public can submit appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit applications" ON recruitment_applications FOR INSERT WITH CHECK (true);

-- Allow Staff/Admin full access for CRUD operations (Anon Key / Authenticated)
CREATE POLICY "Full access to hospitals" ON hospitals FOR ALL USING (true);
CREATE POLICY "Full access to services" ON services FOR ALL USING (true);
CREATE POLICY "Full access to doctors" ON doctors FOR ALL USING (true);
CREATE POLICY "Full access to appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Full access to patient_records" ON patient_records FOR ALL USING (true);
CREATE POLICY "Full access to gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Full access to videos" ON videos FOR ALL USING (true);
CREATE POLICY "Full access to recruitment_positions" ON recruitment_positions FOR ALL USING (true);
CREATE POLICY "Full access to recruitment_applications" ON recruitment_applications FOR ALL USING (true);
CREATE POLICY "Full access to announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Full access to audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Full access to users" ON users FOR ALL USING (true);

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- Seed Hospitals
INSERT INTO hospitals (id, name, short_name, tagline, description, address, hotline, dispatch_code, logo_path, primary_color) VALUES
('nusawardenna', 'Rumah Sakit Umum Nusawardenna', 'RS Nusawardenna', 'Pusat Rujukan Medis Trauma & Kegawatdaruratan San Andreas', 'Fasilitas rumah sakit rujukan utama dengan penanganan trauma bedah cito 24 jam.', 'Jl. Sudirman No. 101, Pusat Kota', '911 / (021) 555-0199', 'DISPATCH-NW-911', '/logo/logo-nusawardenna.png', '#0284c7'),
('revenhill', 'Medical Center Revenhill', 'MC Revenhill', 'Pusat Keunggulan Bedah Saraf, Kardiologi & Kamar Perawatan VIP', 'Pusat keunggulan medis dengan layanan spesialis saraf robotik dan perawatan privat eksklusif.', 'Kawasan Medis Terpadu Revenhill Blvd No. 88', '911 / (021) 555-0288', 'DISPATCH-RH-911', '/logo/logo-revenhill.png', '#059669')
ON CONFLICT (id) DO NOTHING;

-- Seed Users
INSERT INTO users (id, name, email, password, role, hospital_id, badge_number, avatar) VALUES
('user-admin', 'Chief Medical Administrator', 'admin', 'admin', 'ADMIN', 'all', 'HQ-ADMIN-01', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
('user-doc-vance', 'Dr. Raymond Vance', 'vance', '123', 'DOCTOR', 'nusawardenna', 'NW-MED-01', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'),
('user-doc-rostova', 'Dr. Elena Rostova', 'rostova', '123', 'DOCTOR', 'nusawardenna', 'NW-MED-12', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'),
('user-doc-sterling', 'Dr. Kimberly Sterling', 'sterling', '123', 'DOCTOR', 'revenhill', 'RH-DIR-01', 'https://images.unsplash.com/photo-1594824813637-43f11075d94e?auto=format&fit=crop&w=200&q=80')
ON CONFLICT (id) DO NOTHING;
