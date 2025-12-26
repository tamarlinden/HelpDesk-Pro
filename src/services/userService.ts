import api from './api';
import { type CreateUserData, type User } from '../types/user';


// שליפת כל המשתמשים
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users", error);
        throw error;
    }
};

// שליפת כל המשתמשים שהם Agents
export const getAgents = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        // סינון המשתמשים כך שיוצגו רק אלו שתפקידם agent
        const allUsers: User[] = response.data;
        return allUsers.filter(u => u.role === 'agent');
    } catch (error) {
        console.error("Error fetching agents", error);
        throw error;
    }
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user", error);
        throw error;
    }
};