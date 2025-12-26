import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTicketById, getComments, addComment, updateTicket, getStatuses } from '../services/ticketService';
import { getAgents } from '../services/userService';
import type { Ticket, Comment, Status } from '../types/ticket';
import type { User } from '../types/user';

const TicketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [agents, setAgents] = useState<User[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const user = useContext(AuthContext)?.state.user;

    const loadData = async () => {
        if (!id) return;
        try {
            const [ticketData, commentsData, statusesData] = await Promise.all([
                getTicketById(id),
                getComments(id),
                getStatuses()
            ]);
            setTicket(ticketData);
            setComments(commentsData);
            setStatuses(statusesData);
            
            if (user?.role === 'admin') {
                const agentsData = await getAgents();
                setAgents(agentsData);
            }
        } catch (error) {
            console.error('שגיאה בטעינת הנתונים:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [id, user]);

    const handleStatusChange = async (statusId: number) => {
        if (!id) return;
        await updateTicket(Number(id), { status_id: statusId });
        loadData();
    };

    const handleAssignAgent = async (agentId: number) => {
        if (!id) return;
        await updateTicket(Number(id), { assigned_to: agentId });
        loadData();
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim()) return;
        await addComment(id, newComment);
        setNewComment('');
        loadData();
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'זה עתה';
        return new Date(dateStr).toLocaleString('he-IL');
    };

    const translateStatus = (status: string) => {
        const translations: Record<string, string> = {
            'open': 'פתוח',
            'in-progress': 'בטיפול',
            'closed': 'סגור'
        };
        return translations[status.toLowerCase()] || status;
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <span>טוען פרטי פנייה...</span>
            </div>
        );
    }

    if (!ticket) {
        return <div className="page-container"><p>הפנייה לא נמצאה</p></div>;
    }

    const getStatusBadge = (status: string) => {
        const map: Record<string, { class: string; label: string }> = {
            'open': { class: 'badge-open', label: 'פתוח' },
            'in-progress': { class: 'badge-in-progress', label: 'בטיפול' },
            'closed': { class: 'badge-closed', label: 'סגור' }
        };
        const s = map[status?.toLowerCase()] || { class: 'badge-open', label: status };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const map: Record<string, { class: string; label: string }> = {
            'low': { class: 'badge-priority-low', label: 'נמוכה' },
            'medium': { class: 'badge-priority-medium', label: 'בינונית' },
            'high': { class: 'badge-priority-high', label: 'גבוהה' },
            'very-high': { class: 'badge-priority-high', label: 'דחופה' }
        };
        const p = map[priority?.toLowerCase()] || { class: 'badge-priority-medium', label: priority };
        return <span className={`badge ${p.class}`}>{p.label}</span>;
    };

    return (
        <div className="page-container ticket-details-page">
            <button 
                onClick={() => navigate('/tickets')}
                className="btn btn-secondary"
            >
                <span>←</span>
                <span>חזרה לרשימת הפניות</span>
            </button>

            <div className="ticket-details-wrapper">
                {/* כרטיס כותרת ופרטים */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h2>{ticket.subject}</h2>
                            <small>פנייה #{ticket.id}</small>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {getStatusBadge(ticket.status_name || '')}
                            {getPriorityBadge(ticket.priority_name || '')}
                        </div>
                    </div>
                    <div className="card-body">
                        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                            {ticket.description}
                        </p>
                        
                        {/* פרטים לרוחב */}
                        <div className="ticket-info-grid">
                            <div className="ticket-info-item">
                                <div className="ticket-info-label">תאריך יצירה</div>
                                <div className="ticket-info-value">{formatDate(ticket.created_at)}</div>
                            </div>
                            <div className="ticket-info-item">
                                <div className="ticket-info-label">נוצר על ידי</div>
                                <div className="ticket-info-value">{ticket.created_by_name || 'לא ידוע'}</div>
                            </div>
                            <div className="ticket-info-item">
                                <div className="ticket-info-label">הוקצה ל</div>
                                <div className="ticket-info-value">{ticket.assigned_to_name || 'לא הוקצה'}</div>
                            </div>
                            <div className="ticket-info-item">
                                <div className="ticket-info-label">סטטוס</div>
                                <div className="ticket-info-value">{ticket.status_name || 'לא ידוע'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ניהול */}
                {(user?.role === 'admin' || user?.role === 'agent') && (
                    <div className="card">
                        <div className="card-header">
                            <h3>פעולות ניהול</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="status" className="form-label">עדכון סטטוס</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-select"
                                    value={ticket.status_id}
                                    onChange={(e) => handleStatusChange(Number(e.target.value))}
                                >
                                    {statuses.map(s => (
                                        <option key={s.id} value={s.id}>{translateStatus(s.name)}</option>
                                    ))}
                                </select>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="form-group">
                                    <label htmlFor="agent" className="form-label">הקצה לנציג</label>
                                    <select
                                        id="agent"
                                        name="agent"
                                        className="form-select"
                                        value={ticket.assigned_to || ''}
                                        onChange={(e) => handleAssignAgent(Number(e.target.value))}
                                    >
                                        <option value="">בחר נציג...</option>
                                        {agents.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="card">
                <div className="card-body">
                    <h3>התכתבות ({comments.length})</h3>
                    
                    {comments.length === 0 ? (
                        <p>
                            אין הודעות עדיין. התחל את השיחה!
                        </p>
                    ) : (
                        <div className="chat-container">
                            {comments.map(c => {
                                const isCustomer = c.author_id === ticket.created_by;
                                const isAgent = c.author_id === ticket.assigned_to;
                                let role = 'admin';
                                if (isCustomer) role = 'customer';
                                else if (isAgent) role = 'agent';
                                
                                return (
                                    <div 
                                        key={c.id} 
                                        className={`chat-bubble chat-bubble-${role}`}
                                    >
                                        <div className="chat-bubble-header">
                                            <span className="chat-author">{c.author_name}</span>
                                            <span className="chat-time">{formatDate(c.created_at)}</span>
                                        </div>
                                        <p className="chat-text">{c.content}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <form onSubmit={handleAddComment} className="chat-input-form">
                        <label htmlFor="newComment" className="visually-hidden"></label>
                        <textarea
                            id="newComment"
                            name="newComment"
                            className="form-textarea chat-input"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="כתוב הודעה..."
                            required
                        />
                        <button type="submit" className="btn btn-primary chat-send-btn">שלח</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;