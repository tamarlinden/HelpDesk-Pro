import { useState, useEffect } from 'react';
import { getStatuses, getPriorities, createStatus, createPriority } from '../services/ticketService';
import { createUser, getUsers} from '../services/userService';
import type { Status, Priority } from '../types/ticket';
import type { CreateUserData, User } from '../types/user';
import { useToast } from '../components/Toast';

const AdminPanel = () => {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newStatus, setNewStatus] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [newUser, setNewUser] = useState<CreateUserData>({ name: '', email: '', password: '', role: 'agent' });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'agent' | 'customer' | null>(null);
    const { showToast } = useToast();

    const translateStatus = (status: string) => {
        const translations: Record<string, string> = {
            'open': 'פתוח',
            'in-progress': 'בטיפול',
            'closed': 'סגור'
        };
        return translations[status.toLowerCase()] || status;
    };

    const translatePriority = (priority: string) => {
        const translations: Record<string, string> = {
            'low': 'נמוכה',
            'medium': 'בינונית',
            'high': 'גבוהה',
            'very-high': 'דחופה'
        };
        return translations[priority.toLowerCase()] || priority;
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const loadData = async () => {
        try {
            const [statusesData, prioritiesData, usersData] = await Promise.all([
                getStatuses(),
                getPriorities(),
                getUsers()
            ]);
            setStatuses(statusesData);
            setPriorities(prioritiesData);
            setUsers(usersData);
        } catch (error) {
            console.error('שגיאה בטעינת הנתונים:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStatus.trim()) return;
        try {
            await createStatus(newStatus);
            setNewStatus('');
            showToast('סטטוס נוסף בהצלחה!', 'success');
            loadData();
        } catch (error) {
            showToast('שגיאה בהוספת סטטוס', 'error');
        }
    };

    const handleAddPriority = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPriority.trim()) return;
        try {
            await createPriority(newPriority);
            setNewPriority('');
            showToast('דחיפות נוספה בהצלחה!', 'success');
            loadData();
        } catch (error) {
            showToast('שגיאה בהוספת דחיפות', 'error');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
            showToast('נא למלא את כל השדות', 'error');
            return;
        }
        try {
            await createUser(newUser);
            setNewUser({ name: '', email: '', password: '', role: 'agent' });
            showToast('משתמש נוסף בהצלחה!', 'success');
            loadData();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'שגיאה בהוספת משתמש', 'error');
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'מנהל';
            case 'agent': return 'נציג';
            case 'customer': return 'לקוח';
            default: return role;
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <span>טוען...</span>
            </div>
        );
    }

    return (
        <>
            <div className="page-container admin-panel-page">
                <div className="page-header">
                    <h1 className="page-title">לוח ניהול</h1>
                    <p className="page-subtitle">ניהול סטטוסים, דחיפויות ומשתמשים במערכת</p>
                </div>

            <div className="admin-cards-grid">
                <div className="card">
                    <div className="card-header">
                        <h3>סטטוסים</h3>
                    </div>
                    <div className="card-body">
                        <div className="admin-items-list">
                            {statuses.map(s => (
                                <div key={s.id} className="admin-item">
                                    <span className="admin-item-name">{translateStatus(s.name)}</span>
                                    <span className="admin-item-id">#{s.id}</span>
                                </div>
                            ))}
                        </div>
                        
                        <form onSubmit={handleAddStatus}>
                            <label htmlFor="newStatus" className="visually-hidden"></label>
                            <input
                                id="newStatus"
                                name="newStatus"
                                type="text"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                placeholder="שם סטטוס חדש..."
                                className="form-input"
                            />
                            <button type="submit" className="btn btn-primary">הוסף</button>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>דחיפויות</h3>
                    </div>
                    <div className="card-body">
                        <div className="admin-items-list">
                            {priorities.map(p => (
                                <div key={p.id} className="admin-item">
                                    <span className="admin-item-name">{translatePriority(p.name)}</span>
                                    <span className="admin-item-id">#{p.id}</span>
                                </div>
                            ))}
                        </div>
                        
                        <form onSubmit={handleAddPriority}>
                            <label htmlFor="newPriority" className="visually-hidden"></label>
                            <input
                                id="newPriority"
                                name="newPriority"
                                type="text"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                                placeholder="שם דחיפות חדשה..."
                                className="form-input"
                            />
                            <button type="submit" className="btn btn-primary">הוסף</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>ניהול משתמשים</h3>
                </div>
                <div className="card-body">
                    <div className="admin-role-buttons">
                        <button 
                            onClick={() => { setSelectedRole('admin'); setShowModal(true); }}
                            className="btn"
                        >
                            מנהל
                        </button>
                        <button 
                            onClick={() => { setSelectedRole('agent'); setShowModal(true); }}
                            className="btn"
                        >
                            נציג
                        </button>
                        <button 
                            onClick={() => { setSelectedRole('customer'); setShowModal(true); }}
                            className="btn"
                        >
                            לקוח
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddUser}>
                        <div className="form-group">
                            <label htmlFor="userName" className="form-label">שם</label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="שם המשתמש"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userEmail" className="form-label">אימייל</label>
                            <input
                                id="userEmail"
                                name="userEmail"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="email@example.com"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userPassword" className="form-label">סיסמה</label>
                            <input
                                id="userPassword"
                                name="userPassword"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="סיסמה"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userRole" className="form-label">תפקיד</label>
                            <select
                                id="userRole"
                                name="userRole"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'customer' | 'agent' | 'admin' })}
                                className="form-input"
                            >
                                <option value="agent">נציג (Agent)</option>
                                <option value="admin">מנהל (Admin)</option>
                                <option value="customer">לקוח (Customer)</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary">הוסף משתמש</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>

            {showModal && selectedRole && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{getRoleLabel(selectedRole)}</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {users.filter(u => u.role === selectedRole).map(u => (
                                <div key={u.id} className="modal-user-item">
                                    <div className="modal-user-info">
                                        <div className="modal-user-name">{u.name}</div>
                                        <div className="modal-user-email">{u.email}</div>
                                    </div>
                                    <span className="modal-user-badge">
                                        {getRoleLabel(u.role)}
                                    </span>
                                </div>
                            ))}
                            {users.filter(u => u.role === selectedRole).length === 0 && (
                                <div className="modal-empty">
                                    אין משתמשים בתפקיד זה
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPanel;
