export interface User {
  id: number; // או number - יש לוודא ב-Swagger
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}
// יצירת משתמש חדש (admin בלבד)
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'agent' | 'admin';
}
