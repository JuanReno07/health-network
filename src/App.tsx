import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/common/LoginModal';
import { AppointmentTicketModal } from './components/common/AppointmentTicketModal';
import { AppointmentTrackerModal } from './components/common/AppointmentTrackerModal';

// Public Sections
import { HeroSection } from './components/public/HeroSection';
import { StatsSection } from './components/public/StatsSection';
import { AboutSection } from './components/public/AboutSection';
import { ServicesSection } from './components/public/ServicesSection';
import { DoctorsSection } from './components/public/DoctorsSection';
import { AppointmentBookingSection } from './components/public/AppointmentBookingSection';
import { GallerySection } from './components/public/GallerySection';
import { VideoSection } from './components/public/VideoSection';
import { RecruitmentSection } from './components/public/RecruitmentSection';
import { AnnouncementsSection } from './components/public/AnnouncementsSection';
import { ContactSection } from './components/public/ContactSection';

// Dashboard Modules
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminOverview } from './components/dashboard/AdminOverview';
import { AdminAppointments } from './components/dashboard/AdminAppointments';
import { AdminServices } from './components/dashboard/AdminServices';
import { AdminDoctors } from './components/dashboard/AdminDoctors';
import { AdminRecruitment } from './components/dashboard/AdminRecruitment';
import { AdminGalleryVideos } from './components/dashboard/AdminGalleryVideos';
import { AdminAnnouncements } from './components/dashboard/AdminAnnouncements';
import { AdminHospitalInfo } from './components/dashboard/AdminHospitalInfo';
import { AdminUserManagement } from './components/dashboard/AdminUserManagement';
import { AdminAuditLogs } from './components/dashboard/AdminAuditLogs';
import { DoctorWorkstation } from './components/dashboard/DoctorWorkstation';
import { DoctorPatientRecords } from './components/dashboard/DoctorPatientRecords';
import { DoctorProfile } from './components/dashboard/DoctorProfile';

import { Doctor, Appointment } from './types';

const MainApp: React.FC = () => {
  const { currentUser } = useHospital();

  const [currentView, setCurrentViewState] = useState<'public' | 'dashboard'>(() => {
    if (!currentUser) return 'public'; // no session = always public
    return (localStorage.getItem('gta_rs_current_view') as 'public' | 'dashboard') || 'public';
  });

  const [currentDashboardTab, setCurrentDashboardTabState] = useState<string>(() => {
    if (currentUser?.role === 'ADMIN') {
      return localStorage.getItem('gta_rs_active_tab') || 'overview';
    }
    if (currentUser?.role === 'DOCTOR') {
      return localStorage.getItem('gta_rs_active_tab') || 'doctor-workstation';
    }
    return 'overview';
  });

  // Wrapped setters that also persist to localStorage
  const setCurrentView = (view: 'public' | 'dashboard') => {
    setCurrentViewState(view);
    localStorage.setItem('gta_rs_current_view', view);
  };

  const setCurrentDashboardTab = (tab: string) => {
    setCurrentDashboardTabState(tab);
    localStorage.setItem('gta_rs_active_tab', tab);
  };

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [ticketModalAppointment, setTicketModalAppointment] = useState<Appointment | null>(null);

  // Preselected Doctor for booking from doctor directory
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);

  // Initial Appointment for Doctor creating Patient Record
  const [initialAppointmentForRecord, setInitialAppointmentForRecord] = useState<Appointment | null>(null);

  // Automatically switch back to Public Website if user logs out while in dashboard
  React.useEffect(() => {
    if (!currentUser && currentView === 'dashboard') {
      setCurrentView('public');
      // Also clear persisted tab so next login starts fresh
      localStorage.removeItem('gta_rs_active_tab');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentUser, currentView]);

  // On login success, set view to dashboard and restore the correct default tab
  React.useEffect(() => {
    if (currentUser && currentView === 'public') {
      // Don't auto-redirect on public view unless we have a persisted dashboard view
      const savedView = localStorage.getItem('gta_rs_current_view');
      if (savedView === 'dashboard') {
        setCurrentViewState('dashboard');
      }
    }
  }, [currentUser]);

  const navigateToBooking = (doc?: Doctor) => {
    if (doc) {
      setPreselectedDoctor(doc);
    }
    if (currentView === 'dashboard') {
      setCurrentView('public');
    }
    setTimeout(() => {
      const el = document.getElementById('booking');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigateToServices = () => {
    if (currentView === 'dashboard') setCurrentView('public');
    setTimeout(() => {
      const el = document.getElementById('services');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigateToAbout = () => {
    if (currentView === 'dashboard') setCurrentView('public');
    setTimeout(() => {
      const el = document.getElementById('about');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAppointmentCreated = (appointment: Appointment) => {
    setTicketModalAppointment(appointment);
  };

  const handleDoctorOpenCreateRecord = (appointment?: Appointment) => {
    if (appointment) {
      setInitialAppointmentForRecord(appointment);
    }
    setCurrentDashboardTab('records');
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {currentView === 'public' ? (
        <>
          {/* Public Top Navbar */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onOpenTracker={() => setIsTrackerModalOpen(true)}
            onNavigateToBooking={() => navigateToBooking()}
          />

          {/* Public Main Body */}
          <main className="flex-1">
            <HeroSection
              onNavigateToBooking={() => navigateToBooking()}
              onNavigateToServices={navigateToServices}
              onNavigateToAbout={navigateToAbout}
              onOpenTracker={() => setIsTrackerModalOpen(true)}
            />

            <StatsSection />

            <AnnouncementsSection />

            <AboutSection />

            <ServicesSection onNavigateToBooking={() => navigateToBooking()} />

            <DoctorsSection onSelectDoctorForBooking={doc => navigateToBooking(doc)} />

            <AppointmentBookingSection
              preselectedDoctor={preselectedDoctor}
              onAppointmentCreated={handleAppointmentCreated}
            />

            <GallerySection />

            <VideoSection />

            <RecruitmentSection />

            <ContactSection />
          </main>

          {/* Public Footer */}
          <Footer
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onNavigateToBooking={() => navigateToBooking()}
          />
        </>
      ) : (
        /* Hospital Management Dashboard View */
        <DashboardLayout
          currentTab={currentDashboardTab}
          setCurrentTab={setCurrentDashboardTab}
          onExitToPublic={() => setCurrentView('public')}
        >
          {/* Admin Tabs */}
          {currentUser?.role === 'ADMIN' && (
            <>
              {currentDashboardTab === 'overview' && (
                <AdminOverview onNavigateToTab={tab => setCurrentDashboardTab(tab)} />
              )}
              {currentDashboardTab === 'appointments' && (
                <AdminAppointments onPrintTicket={apt => setTicketModalAppointment(apt)} />
              )}
              {currentDashboardTab === 'services' && <AdminServices />}
              {currentDashboardTab === 'doctors' && <AdminDoctors />}
              {currentDashboardTab === 'records' && (
                <DoctorPatientRecords
                  initialAppointment={initialAppointmentForRecord}
                  onClearInitialAppointment={() => setInitialAppointmentForRecord(null)}
                />
              )}
              {currentDashboardTab === 'recruitment' && <AdminRecruitment />}
              {currentDashboardTab === 'media' && <AdminGalleryVideos />}
              {currentDashboardTab === 'announcements' && <AdminAnnouncements />}
              {currentDashboardTab === 'hospital-info' && <AdminHospitalInfo />}
              {currentDashboardTab === 'users' && <AdminUserManagement />}
              {currentDashboardTab === 'audit-logs' && <AdminAuditLogs />}
            </>
          )}

          {/* Doctor Tabs */}
          {currentUser?.role === 'DOCTOR' && (
            <>
              {currentDashboardTab === 'doctor-workstation' && (
                <DoctorWorkstation
                  onOpenCreateRecord={apt => handleDoctorOpenCreateRecord(apt)}
                />
              )}
              {currentDashboardTab === 'records' && (
                <DoctorPatientRecords
                  initialAppointment={initialAppointmentForRecord}
                  onClearInitialAppointment={() => setInitialAppointmentForRecord(null)}
                />
              )}
              {currentDashboardTab === 'doctor-profile' && <DoctorProfile />}
            </>
          )}
        </DashboardLayout>
      )}

      {/* Shared Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setCurrentView('dashboard');
          setCurrentDashboardTab(currentUser?.role === 'DOCTOR' ? 'doctor-workstation' : 'overview');
        }}
      />

      <AppointmentTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        onSelectTicketForPrint={apt => setTicketModalAppointment(apt)}
      />

      <AppointmentTicketModal
        appointment={ticketModalAppointment}
        isOpen={Boolean(ticketModalAppointment)}
        onClose={() => setTicketModalAppointment(null)}
      />
    </div>
  );
};

export function App() {
  return (
    <HospitalProvider>
      <MainApp />
    </HospitalProvider>
  );
}

export default App;
