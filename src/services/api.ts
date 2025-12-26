import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000', // ודאי שזה הפורט שבו השרת שלך רץ
});

// שליחת הטוקן אוטומטית בכל קריאה
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;