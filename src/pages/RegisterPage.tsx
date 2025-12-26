import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

interface IRegisterForm {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<IRegisterForm>();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const authContext = useContext(AuthContext);
    const { showToast } = useToast();

    const onSubmit = async (data: IRegisterForm) => {
        setLoading(true);
        try {
            await registerUser(data);
            // התחברות אוטומטית אחרי הרשמה
            const res = await login(data.email, data.password);
            if (authContext) {
                authContext.dispatch({ 
                    type: 'LOGIN_SUCCESS', 
                    payload: { user: res.user, token: res.token } 
                });
            }
            showToast('נרשמת והתחברת בהצלחה!', 'success');
            nav('/dashboard');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'ההרשמה נכשלה', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>HelpDesk Pro</h2>
                    <p>הרשמה למערכת</p>
                </div>
                
                <div className="login-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">שם מלא</label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: 'שדה חובה' })}
                                className="form-input"
                                placeholder="הזן שם מלא..."
                            />
                            {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>

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
                                {...register('password', { required: 'שדה חובה', minLength: { value: 6, message: 'מינימום 6 תווים' } })}
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
                            {loading ? 'נרשם...' : 'הירשם למערכת'}
                        </button>
                    </form>

                    <p>
                        כבר יש לך חשבון? {' '}
                        <Link to="/login">
                            התחבר כאן
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
