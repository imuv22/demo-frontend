import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApi, meApi, signupApi, uploadProfilePictureApi } from "../apis/adminApis";
import { failedToast, successToast } from "../utils/Toaster";

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || 'Something went wrong';

const saveSession = (queryClient, payload) => {
    localStorage.setItem('token', payload.token);
    queryClient.setQueryData(['me'], payload.user);
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signupApi,
        onSuccess: (payload) => {
            saveSession(queryClient, payload);
            successToast('Account created');
        },
        onError: (error) => {
            failedToast(getErrorMessage(error));
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (payload) => {
            saveSession(queryClient, payload);
            successToast('Signed in');
        },
        onError: (error) => {
            failedToast(getErrorMessage(error));
        },
    });
};

export const useMe = () => {
    const hasToken = Boolean(localStorage.getItem('token'));

    return useQuery({
        queryKey: ['me'],
        queryFn: meApi,
        enabled: hasToken,
        retry: false,
    });
};

export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfilePictureApi,
        onSuccess: (user) => {
            queryClient.setQueryData(['me'], user);
            successToast('Profile picture updated');
        },
        onError: (error) => {
            failedToast(getErrorMessage(error));
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            localStorage.removeItem('token');
        },
        onSuccess: () => {
            queryClient.setQueryData(['me'], null);
            queryClient.removeQueries({ queryKey: ['me'] });
            successToast('Signed out');
        },
    });
};
