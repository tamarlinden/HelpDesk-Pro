import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <div>
                        <Navbar />
                        <main>
                            <AppRoutes />
                        </main>
                    </div>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;