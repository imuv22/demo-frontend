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

export const uploadProfilePictureApi = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/admin/profile-picture', formData);
    return response.data.data;
};

export const createProfilePictureVerificationSessionApi = async () => {
    const response = await api.post('/facetec/profile-picture/start');
    return response.data.data;
};

export const completeProfilePictureVerificationApi = async (
    payload
) => {
    const response = await api.post(
        '/facetec/profile-picture/complete',
        payload
    );
    return response.data.data;
};

