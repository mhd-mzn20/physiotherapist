import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import UserNavbar from './components/userNavbar.jsx'
import Header from './components/Header.jsx'
import PhysioHeader from './components/PhysioHeader.jsx'
import Footer from './components/Footer.jsx'
import UserFooter from './components/userFooter.jsx'
import { ProtectedUserRoute, ProtectedPatientRoute } from './components/ProtectedRoute';
import AdminHeader from './components/AdminHeader.jsx';


import Login from './pages/Login.jsx'
import { Outlet } from 'react-router-dom';

import Portal from './pages/Portal.jsx'

import Patients from './pages/Patients.jsx'
import PatientsBiomedical from './pages/PatientsBiomedical.jsx'
import SessionsBiomedical from './pages/SessionsBiomedical.jsx'
import Sessions from './pages/Sessions.jsx'
import AddPatient from './pages/AddPatient.jsx'
import VideoPlayer from './pages/VideoPlayer.jsx'


import CreateCollaboration from './pages/CreateCollaboration.jsx'

import Therapy from './pages/Therapy.jsx'
import Biomedical from './pages/Biomedical.jsx'

import AddUser from './pages/AddUser.jsx'
import BiomedicalView from './pages/BiomedicalView.jsx'
import AdminPatients from './pages/AdminPatients.jsx'
import AdminServices from './pages/AdminServices.jsx'
//mhd-mzn
import Availability from './pages/availibility.jsx'
import PhysioDashboard from './pages/PhysioDashboard.jsx'
import PhysioProfile from './pages/PhysioProfile.jsx'
import TreatmentPlan from './pages/Treatement.jsx'
import Trainings from './pages/trainings.jsx'
import Visits from './pages/Visits.jsx'

import Home from './pages/user/Home.jsx'
import Services from './pages/user/Services.jsx'
import Physio from './pages/user/Physio.jsx'
import Register from './pages/user/Register.jsx'
import About from './pages/user/About.jsx'
import Booking from './pages/user/Booking.jsx'
import Payment from './pages/user/Payment.jsx'
import PatientReservations from './pages/user/PatientReservations.jsx'
import ViewPhysioProfile from './pages/user/ViewPhysioProfile.jsx'
import SessionHistory from './pages/user/SessionHistory.jsx'
import PatientTrainings from './pages/user/trainingspatient.jsx'



const PatientLayout = () => (
  <>
    <UserNavbar />
    <Outlet />
    <UserFooter />
  </>
);

const AdminLayout = () => (
  <>
    <AdminHeader />
    <Outlet />
  </>
);

const PhysioLayout = () => (
  <>
    <PhysioHeader />
    <Outlet />
    <Footer />
  </>
);
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route element={<ProtectedUserRoute />}>
            <Route path="/portal" element={<Portal />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/create-collaboration" element={<CreateCollaboration />} />
            <Route path="/admin-patients" element={<AdminPatients />} />
            <Route path="/admin-services" element={<AdminServices />} />

            {/*biomedical */}
            <Route path="/patients-biomedical/:idUser" element={<PatientsBiomedical />} />
            <Route
              path="/sessions-biomedical/:idBiomedical/:idPhysiotherapist/:idpatient"
              element={<SessionsBiomedical />}
            />
            <Route
              path="/biomedical/:idengineer/:idphysiotherapist/:idpatient"
              element={<Biomedical />}
            />
          </Route>
        </Route>





        <Route element={<PhysioLayout />}>
          <Route element={<ProtectedUserRoute />}>

            <Route path="/video/:filename" element={<VideoPlayer />} />
            <Route path="/patients/:idUser" element={<Patients />} />



            {/* Read-only biomedical info for physiotherapists */}
            <Route
              path="/biomedical-view/:idpatient"
              element={<BiomedicalView />}
            />
            <Route path="/sessions/:iduser/:idpatient" element={<Sessions />} />
            <Route path="/add-patient" element={<AddPatient />} />

            <Route path="/therapy/:iduser/:idpatient/:idsession?" element={<Therapy />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/availability/:idUser" element={<Availability />} />
            <Route path="/physio-dashboard/:idUser" element={<PhysioDashboard />} />
            <Route path="/physioprofile/:idUser" element={<PhysioProfile />} />
            <Route path="/treatement/:iduser/:idpatient" element={<TreatmentPlan />} />
            <Route path="/trainings/:idsession" element={<Trainings />} />
            <Route path="/visits/:iduser/:idpatient" element={<Visits />} />
          </Route>
        </Route>


        <Route element={<PatientLayout />}>
          <Route element={<ProtectedPatientRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/physio" element={<Physio />} />

            <Route path="/about" element={<About />} />
            <Route path="/booking/:physioId" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/patient-reservations" element={<PatientReservations />} />
            <Route path="/view-physio/:id" element={<ViewPhysioProfile />} />
            <Route path="/session-history/:idBooking" element={<SessionHistory />} />
            <Route path="/my-trainings/:idsession" element={<PatientTrainings />} />
          </Route>

        </Route>
      </Routes>

    </BrowserRouter>

  )
}

export default App
