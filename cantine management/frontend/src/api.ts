const API_BASE_URL = 'http://localhost:5000/api';

type ApiOptions = {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
};

const apiFetch = async (path: string, options: ApiOptions = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'API request failed');
    }
    return response.json();
};

export const fetchStats = async () => {
    return apiFetch('/stats');
};

export const fetchMenu = async () => {
    return apiFetch('/menu');
};

export const addMenuItem = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'API request failed');
    }
    return response.json();
};

export const updateMenuItem = async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'API request failed');
    }
    return response.json();
};

export const deleteMenuItem = async (id: number) => {
    return apiFetch(`/menu/${id}`, { method: 'DELETE' });
};

export const fetchOrders = async () => {
    return apiFetch('/orders');
};

export const updateOrderStatus = async (id: number, status: string) => {
    return apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
};

export const fetchCategories = async () => {
    return apiFetch('/categories');
};

export const addCategory = async (category: any) => {
    return apiFetch('/categories', { method: 'POST', body: category });
};

export const updateCategory = async (id: number, category: any) => {
    return apiFetch(`/categories/${id}`, { method: 'PUT', body: category });
};

export const deleteCategory = async (id: number) => {
    return apiFetch(`/categories/${id}`, { method: 'DELETE' });
};

export const fetchUsers = async () => {
    return apiFetch('/users');
};

export const createUser = async (user: any) => {
    return apiFetch('/users', { method: 'POST', body: user });
};

export const updateUser = async (id: number, user: any) => {
    return apiFetch(`/users/${id}`, { method: 'PUT', body: user });
};

export const setUserActive = async (id: number, is_active: boolean) => {
    return apiFetch(`/users/${id}/active`, { method: 'PATCH', body: { is_active } });
};

export const deleteUser = async (id: number) => {
    return apiFetch(`/users/${id}`, { method: 'DELETE' });
};

export const fetchSettings = async () => {
    return apiFetch('/settings');
};

export const updateSettings = async (settings: any) => {
    return apiFetch('/settings', { method: 'PUT', body: settings });
};

export const loginUser = async (credentials: { email: string; password: string; role: string }) => {
    return apiFetch('/login', { method: 'POST', body: credentials });
};

export const createOrder = async (order: any) => {

    return apiFetch('/orders', { method: 'POST', body: order });
};

export const fetchUserOrders = async (userId: number) => {
    return apiFetch(`/orders/user/${userId}`);
};

export const updateOrderPaymentStatus = async (id: number, payment_status: 'Unpaid' | 'Paid') => {
    return apiFetch(`/orders/${id}/payment`, { method: 'PATCH', body: { payment_status } });
};
