import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import TicketsList from '../pages/TicketsList';
import PrivateRoute from './PrivateRoute';
import NewTicket from '../pages/NewTicket';
import NotFound from '../pages/NotFound';
import TicketDetails from '../pages/TicketDetails';
import AdminPanel from '../pages/AdminPanel';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ניתובים מוגנים לכל מי שמחובר */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketsList />} />
                <Route path="/tickets/:id" element={<TicketDetails />} />
            </Route>

            {/* פתיחת טיקט - רק ללקוחות */}
            <Route element={<PrivateRoute allowedRoles={['customer']} />}>
                <Route path="/tickets/new" element={<NewTicket />} />
            </Route>

            {/* לוח ניהול - רק לאדמין */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPanel />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;