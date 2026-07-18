import api from "../libs/axios";

export const signupApi = async (payload) => {
    const response = await api.post('/admin/signup', payload);
    return response.data.data;
};

export const loginApi = async (payload) => {
    const response = await api.post('/admin/login', payload);
    return response.data.data;
};

export const meApi = async () => {
    const response = await api.get('/admin/me');
    return response.data.data;
};

