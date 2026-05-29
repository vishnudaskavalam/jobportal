export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
    updatedAt: Date;
}