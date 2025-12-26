import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, getStatuses } from '../services/ticketService';
import { getAgents } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import type { Ticket, Status } from '../types/ticket';
import type { User } from '../types/user';

const TicketsList = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [agentFilter, setAgentFilter] = useState('');
    const [agents, setAgents] = useState<User[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);
    const user = authContext?.state.user;

    const fetchTickets = async () => {
        try {
            const data = await getTickets();
            if (user?.role === 'customer') {
                setTickets(data.filter((t: Ticket) => t.created_by === user.id));
            } else if (user?.role === 'agent') {
                setTickets(data.filter((t: Ticket) => t.assigned_to === user.id));
            } else {
                setTickets(data);
            }
            
            // Load statuses
            const statusesData = await getStatuses();
            setStatuses(statusesData);
            
            // Load agents for admin
            if (user?.role === 'admin') {
                const agentsData = await getAgents();
                setAgents(agentsData);
            }
        } catch (error) {
            console.error("שגיאה בטעינת הנתונים");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [user]);

    const translateStatus = (status: string): string => {
        const translations: Record<string, string> = {
            'open': 'פתוח',
            'in-progress': 'בטיפול',
            'closed': 'סגור'
        };
        return translations[status.toLowerCase()] || status;
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { class: string; label: string }> = {
            'open': { class: 'badge-open', label: 'פתוח' },
            'in-progress': { class: 'badge-in-progress', label: 'בטיפול' },
            'closed': { class: 'badge-closed', label: 'סגור' }
        };
        const s = statusMap[status] || { class: 'badge-open', label: status };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const priorityMap: Record<string, { class: string; label: string }> = {
            'low': { class: 'badge-priority-low', label: 'נמוכה' },
            'Low': { class: 'badge-priority-low', label: 'נמוכה' },
            'medium': { class: 'badge-priority-medium', label: 'בינונית' },
            'Medium': { class: 'badge-priority-medium', label: 'בינונית' },
            'high': { class: 'badge-priority-high', label: 'גבוהה' },
            'High': { class: 'badge-priority-high', label: 'גבוהה' },
            'very-high': { class: 'badge-priority-high', label: 'דחופה מאוד' },
            'Very-High': { class: 'badge-priority-high', label: 'דחופה מאוד' }
        };
        const p = priorityMap[priority] || { class: 'badge-priority-medium', label: priority };
        return <span className={`badge ${p.class}`}>{p.label}</span>;
    };

    const filteredTickets = tickets.filter(ticket => {
        // סינון לפי חיפוש טקסט
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
                ticket.subject.toLowerCase().includes(query) ||
                String(ticket.id).includes(query);
            if (!matchesSearch) return false;
        }

        // סינון לפי סטטוס
        if (statusFilter) {
            const ticketStatus = (ticket.status_name || '').toLowerCase();
            if (ticketStatus !== statusFilter.toLowerCase()) return false;
        }

        // סינון לפי עדיפות
        if (priorityFilter) {
            const ticketPriority = (ticket.priority_name || '').toLowerCase();
            if (ticketPriority !== priorityFilter.toLowerCase()) return false;
        }

        // סינון לפי נציג (רק למנהל)
        if (agentFilter && user?.role === 'admin') {
            if (String(ticket.assigned_to) !== agentFilter) return false;
        }

        return true;
    });

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <span>טוען פניות...</span>
            </div>
        );
    }

    return (
        <div className="tickets-page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">רשימת פניות</h1>
                    <p className="page-subtitle">נמצאו {filteredTickets.length} פניות במערכת</p>
                </div>

                <div className="filters-bar">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="חיפוש לפי נושא או מספר..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">כל הסטטוסים</option>
                        {statuses.map(status => (
                            <option key={status.id} value={status.name}>{translateStatus(status.name)}</option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">כל הדחיפויות</option>
                        <option value="low">נמוכה</option>
                        <option value="medium">בינונית</option>
                        <option value="high">גבוהה</option>
                    </select>

                    {user?.role === 'admin' && (
                        <select
                            className="form-select"
                            value={agentFilter}
                            onChange={(e) => setAgentFilter(e.target.value)}
                        >
                            <option value="">כל הנציגים</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    )}

                    {(searchQuery || statusFilter || priorityFilter || agentFilter) && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('');
                                setPriorityFilter('');
                                setAgentFilter('');
                            }}
                        >
                            נקה
                        </button>
                    )}
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>נושא</th>
                                <th>סטטוס</th>
                                <th>דחיפות</th>
                                <th>נוצר על ידי</th>
                                <th>הוקצה ל</th>
                                <th>תאריך</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>
                                        #{ticket.id}
                                    </td>
                                    <td>{ticket.subject}</td>
                                    <td>{getStatusBadge(ticket.status_name || String(ticket.status_id))}</td>
                                    <td>{getPriorityBadge(ticket.priority_name || String(ticket.priority_id))}</td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-table">
                                                {ticket.created_by_name ? ticket.created_by_name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="user-info-table">
                                                <span className="user-name-table">
                                                    {ticket.created_by_name || 'לא ידוע'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {ticket.assigned_to_name ? (
                                            <div className="user-cell">
                                                <div className="user-avatar-table">
                                                    {ticket.assigned_to_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-info-table">
                                                    <span className="user-name-table">
                                                        {ticket.assigned_to_name}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
                                                לא הוקצה
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('he-IL') : '---'}
                                    </td>
                                    <td>
                                        <Link to={`/tickets/${ticket.id}`}>
                                            <button className="btn btn-secondary btn-sm">צפה</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTickets.length === 0 && (
                        <div>
                            <p>{searchQuery ? 'לא נמצאו פניות התואמות לחיפוש' : 'אין פניות להצגה'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketsList;