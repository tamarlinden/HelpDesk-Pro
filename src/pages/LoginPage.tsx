import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

interface ILoginForm {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const authContext = useContext(AuthContext);
    const { showToast } = useToast();

    const onSubmit = async (data: ILoginForm) => {
        setLoading(true);
        try {
            const res = await login(data.email, data.password);
            
            if (authContext) {
                authContext.dispatch({ 
                    type: 'LOGIN_SUCCESS', 
                    payload: { user: res.user, token: res.token } 
                });
            }

            showToast('התחברת בהצלחה', 'success');
            nav('/dashboard');
        } catch (error) {
            showToast('אימייל או סיסמה לא נכונים', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>HelpDesk Pro</h2>
                    <p>ברוכים הבאים למערכת התמיכה</p>
                </div>
                
                <div className="login-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">אימייל</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: 'שדה חובה' })}
                                className="form-input"
                                placeholder="הזן אימייל..."
                            />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">סיסמה</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'שדה חובה' })}
                                className="form-input"
                                placeholder="הזן סיסמה..."
                            />
                            {errors.password && <span className="form-error">{errors.password.message}</span>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn btn-primary btn-lg"
                        >
                            {loading ? 'מתחבר...' : 'התחבר למערכת'}
                        </button>
                    </form>

                    <p>
                        אין לך חשבון עדיין? {' '}
                        <Link to="/register">
                            הירשם כאן
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;