import api from './api';

// קבלת פניות עם סינון לפי תפקיד (מבוצע בשרת/לקוח)
export const getTickets = async () => {
    const response = await api.get('/tickets');
    return response.data;
};

export const getTicketById = async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
};

// יצירת פנייה (Customer בלבד) - משתמש ב-subject
export const createTicket = async (data: { subject: string, description: string, priority_id: number }) => {
    const response = await api.post('/tickets', data);
    return response.data;
};

// עדכון פנייה (Admin/Agent) - שליחת IDs
export const updateTicket = async (id: number, data: { status_id?: number, priority_id?: number, assigned_to?: number }) => {
    const response = await api.patch(`/tickets/${id}`, data);
    return response.data;
};

// תגובות
export const getComments = async (ticketId: string) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
};

// הוספת תגובה - השרת מצפה ל-content
export const addComment = async (ticketId: string, content: string) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, { content });
    return response.data;
};

// אדמין: ניהול סטטוסים ודחיפויות
export const getStatuses = () => api.get('/statuses').then(r => r.data);
export const getPriorities = () => api.get('/priorities').then(r => r.data);
export const createStatus = (name: string) => api.post('/statuses', { name }).then(r => r.data);
export const createPriority = (name: string) => api.post('/priorities', { name }).then(r => r.data);