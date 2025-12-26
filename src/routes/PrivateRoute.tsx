import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Props {
    allowedRoles?: string[];
}

const PrivateRoute = ({ allowedRoles }: Props) => {
    const context = useContext(AuthContext);
    
    if (!context) 
        return null;
    const { state } = context;

    // משתמש לא מחובר - הפניה לדף התחברות
    if (!state.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // בדיקת הרשאות לפי תפקיד
    if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;