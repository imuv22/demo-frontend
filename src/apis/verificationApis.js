import api from '../libs/axios';

export const createVerificationSessionApi = async ({ photo, consent }) => {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('consent', String(consent));

    const response = await api.post('/verification/sessions', formData);
    return response.data.data;
};

export const getVerificationSessionApi = async (verificationId) => {
    const response = await api.get(`/verification/sessions/${verificationId}`);
    return response.data.data;
};

export const refreshVerificationSessionApi = async (verificationId) => {
    const response = await api.post(`/verification/sessions/${verificationId}/refresh`);
    return response.data.data;
};
