import { Navigate, Outlet } from 'react-router-dom';


export const ProtectedUserRoute = () => {
    const userId = sessionStorage.getItem('idUser');
    return userId ? <Outlet /> : <Navigate to="/login" replace />;
};


export const ProtectedPatientRoute = () => {
    const patientId = sessionStorage.getItem('idpatient');
    return patientId ? <Outlet /> : <Navigate to="/login" replace />;
};