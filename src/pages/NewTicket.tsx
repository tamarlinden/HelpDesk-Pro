import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTicket, getPriorities } from '../services/ticketService';
import type { Priority } from '../types/ticket';
import { useToast } from '../components/Toast';

interface INewTicket {
    subject: string;
    description: string;
    priority_id: number;
}

const NewTicket = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<INewTicket>();
    const [loading, setLoading] = useState(false);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const nav = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        getPriorities().then(setPriorities).catch(console.error);
    }, []);

    const onSubmit = async (data: INewTicket) => {
        setLoading(true);
        try {
            await createTicket({
                subject: data.subject,
                description: data.description,
                priority_id: Number(data.priority_id)
            });
            showToast('הפנייה נשלחה בהצלחה!', 'success');
            nav('/tickets');
        } catch (error: any) {
            console.error("Server error:", error.response?.data);
            showToast(error.response?.data?.message || 'שגיאה בשליחת הפנייה', 'error');
        } finally {
            setLoading(false);
        }
    };

    const hebrewNames: Record<string, string> = {
        'low': 'נמוכה', 'Low': 'נמוכה',
        'medium': 'בינונית', 'Medium': 'בינונית',
        'high': 'גבוהה', 'High': 'גבוהה',
    };

    return (
        <div className="page-container new-ticket-page">
            <div className="card">
                <div className="card-header">
                    <h2>פתיחת פנייה חדשה</h2>
                    <p>
                        מלא את הפרטים ונחזור אליך בהקדם
                    </p>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="subject" className="form-label">נושא הפנייה</label>
                            <input
                                id="subject"
                                type="text"
                                {...register("subject", { required: "שדה חובה" })}
                                placeholder="על מה הפנייה?"
                                className="form-input"
                            />
                            {errors.subject && <span className="form-error">{errors.subject.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">תיאור הבעיה</label>
                            <textarea
                                id="description"
                                {...register("description", { required: "שדה חובה" })}
                                placeholder="פרט כאן את הבעיה בפירוט..."
                                className="form-textarea"
                            />
                            {errors.description && <span className="form-error">{errors.description.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority_id" className="form-label">רמת דחיפות</label>
                            <select 
                                id="priority_id" 
                                {...register("priority_id", { required: true })} 
                                className="form-select"
                            >
                                <option value="">בחר דחיפות...</option>
                                {priorities.map(p => (
                                    <option key={p.id} value={p.id}>{hebrewNames[p.name] || p.name}</option>
                                ))}
                            </select>
                            {errors.priority_id && <span className="form-error">שדה חובה</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg"
                        >
                            {loading ? 'שולח...' : 'שלח פנייה'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewTicket;