import axios, { create } from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = 'http://172.20.1.83:8000'

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// auth
export const authAPI = {
    register: (email: string, password: string, full_name?:string) => 
        api.post('/auth/register', {email, password, full_name}),

    login: (email:string, password: string) => 
        api.post('/auth/login', {email, password}),

    me: () => api.get('/auth/me')
};

// transaction
export const transactionsAPI = {
    list: (category?: string) =>
        api.get('/transactions', { params: {category}}),

    create: (data: {title: string; amount: number; payment_type?: string; notes?: string}) => 
        api.post('/transactions', data),

    update: (id:string, data: {title?: string; amount?: number; category?: string; notes?: string}) => 
        api.patch(`/transactions/${id}`, data),

    delete: (id: string) =>
        api.delete(`/transactions/${id}`),
};

// budget
export const budgetsAPI = {
    list: (month_year?: string) =>
        api.get('/budgets', { params: {month_year}}),

    create: (data: {category: string, monthly_limit: number, month_year: string}) =>
        api.post('/budgets', data),

    update: (id: string, monthly_limit: number) => 
        api.patch(`/budgets/${id}`, {monthly_limit}),

    delete: (id: string) => 
        api.delete(`/budgets/${id}`)
}

// insight
export const insightAPI = {
    list: () => api.get('/insights'),
    create: () => api.post('/insights/generate'),
}