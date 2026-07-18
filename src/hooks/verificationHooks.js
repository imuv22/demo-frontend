import { useMutation, useQuery } from '@tanstack/react-query';
import {
    createVerificationSessionApi,
    getVerificationSessionApi,
    refreshVerificationSessionApi,
} from '../apis/verificationApis';
import { failedToast } from '../utils/Toaster';

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || 'Something went wrong';

export const useCreateVerificationSession = () =>
    useMutation({
        mutationFn: createVerificationSessionApi,
        onError: (error) => {
            failedToast(getErrorMessage(error));
        },
    });

export const useVerificationSession = (verificationId, options = {}) =>
    useQuery({
        queryKey: ['verification', verificationId],
        queryFn: () => getVerificationSessionApi(verificationId),
        enabled: Boolean(verificationId) && (options.enabled ?? true),
        retry: false,
        ...options,
    });

export const useRefreshVerificationSession = () =>
    useMutation({
        mutationFn: refreshVerificationSessionApi,
        onError: (error) => {
            failedToast(getErrorMessage(error));
        },
    });
