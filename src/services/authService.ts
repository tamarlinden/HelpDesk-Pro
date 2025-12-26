import api from './api';
import type {AuthResponse } from '../types/user';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // המורה מחזירה את ה-data ישירות
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

export const register = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};