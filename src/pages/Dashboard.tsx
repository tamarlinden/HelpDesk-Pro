import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) 
        return null;

    const { state } = authContext;
    const { user } = state;

    const dashboardContent = {
        customer: {
            title: 'מה נוכל לעזור לך היום?',
            cards: [
                { title: 'פתיחת פנייה חדשה', desc: 'יש לך בעיה או שאלה? נשמח לעזור!', link: '/tickets/new', btnText: 'פתח פנייה' },
                { title: 'הפניות שלי', desc: 'צפה בכל הפניות שפתחת', link: '/tickets', btnText: 'צפה בפניות' }
            ]
        },
        agent: {
            title: 'משימות ממתינות לטיפולך',
            cards: [
                { title: 'פניות לטיפול', desc: 'צפה בפניות שהוקצו אליך', link: '/tickets', btnText: 'צפה בפניות' }
            ]
        },
        admin: {
            title: 'ניהול מערכת התמיכה',
            cards: [
                { title: 'ניהול כל הפניות', desc: 'גישה מלאה לכל הפניות במערכת', link: '/tickets', btnText: 'נהל פניות' }
            ]
        }
    };

    const content = dashboardContent[user?.role as keyof typeof dashboardContent] || dashboardContent.customer;

    return (
        <div className="page-container">
            <div className="dashboard-hero">
                <h1 className="dashboard-greeting">שלום, {user?.name}</h1>
                <p className="dashboard-welcome">ברוכים הבאים למערכת HelpDesk Pro</p>
                
                <h3 style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontWeight: 500 }}>
                    {content.title}
                </h3>

                <div className="dashboard-actions" style={{ gap: '1.5rem' }}>
                    {content.cards.map((card, index) => (
                        <Link 
                            key={index} 
                            to={card.link} 
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="dashboard-card" style={{ minWidth: '280px' }}>
                                <div className="dashboard-card-title">{card.title}</div>
                                <div className="dashboard-card-desc">{card.desc}</div>
                                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                    {card.btnText}
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;