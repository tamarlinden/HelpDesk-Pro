import { useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';



const Navbar = () => {
    const authContext = useContext(AuthContext);
    const nav = useNavigate();
    const { showConfirm, showToast } = useToast();

    
    if (!authContext)
        return null;

    const { state, dispatch } = authContext;

    const handleLogout = async () => {
        const confirmed = await showConfirm({
            title: 'התנתקות מהמערכת',
            text: 'האם אתה בטוח שברצונך להתנתק?',
            confirmText: 'כן, התנתק',
            cancelText: 'ביטול'
        });

        if (confirmed) {
            dispatch({ type: 'LOGOUT' });
            showToast('התנתקת בהצלחה! להתראות', 'success');
            nav('/login');
        }
    };

    if (!state.isAuthenticated) 
        return null;

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    };

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            customer: 'לקוח',
            agent: 'נציג',
            admin: 'מנהל'
        };
        return roles[role] || role;
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">HelpDesk Pro</div>
            
            <div className="navbar-links">
                <Link to="/dashboard" className="navbar-link">דף הבית</Link>
                <Link to="/tickets" className="navbar-link">פניות</Link>
                {/* הצגת כפתור פתיחת טיקט רק ללקוח */}
                {state.user?.role === 'customer' && (
                    <Link to="/tickets/new" className="navbar-link">פנייה חדשה</Link>
                )}
                {state.user?.role === 'admin' && (
                    <Link to="/admin" className="navbar-link">לוח ניהול</Link>
                )}
            </div>

            <div className="navbar-user">
                <div className="navbar-user-info">
                    <div className="user-avatar">{getInitials(state.user?.name || '')}</div>
                    <span className="user-name">{state.user?.name}</span>
                    <span className="user-role">{getRoleLabel(state.user?.role || '')}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"> התנתק
                </button>
            </div>
        </nav>
    );
};

export default Navbar;