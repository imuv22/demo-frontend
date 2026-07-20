import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

import { startFaceTecEnrollment } from '../facetec/startFaceTecEnrollment.js';

const createExternalDatabaseRefID = () => {
    if (typeof crypto.randomUUID === 'function') {
        return `matrimony_${crypto.randomUUID()}`;
    }

    return `matrimony_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
};


const VerifyProfilePicture = () => {

    const navigate = useNavigate();

    const sessionStartedRef = useRef(false);

    const [status, setStatus] = useState('initializing');
    const [errorMessage, setErrorMessage] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    const startVerification = useCallback(async () => {
        try {
            setStatus('initializing');
            setErrorMessage('');
            setVerificationResult(null);

            const externalDatabaseRefID =
                createExternalDatabaseRefID();

            setStatus('scanning');

            const faceTecSessionResult =
                await startFaceTecEnrollment(
                    externalDatabaseRefID
                );

            const result = {
                success: true,
                externalDatabaseRefID,
                sessionStatus:
                    faceTecSessionResult?.status ?? null,
                completedAt: new Date().toISOString(),
            };

            console.log(
                'FaceTec enrollment completed:',
                faceTecSessionResult
            );

            setVerificationResult(result);
            setStatus('completed');
        } catch (error) {
            console.error(
                'FaceTec verification failed:',
                error
            );

            setStatus('failed');
            setErrorMessage(
                error?.message ||
                'Face verification could not be completed.'
            );
        }
    }, []);

    useEffect(() => {
        /*
         * React StrictMode executes effects twice during development.
         * This guard prevents two FaceTec sessions from opening.
         */
        if (sessionStartedRef.current) {
            return;
        }

        sessionStartedRef.current = true;
        startVerification();
    }, [startVerification]);

    const handleRetry = () => {
        startVerification();
    };

    const isProcessing =
        status === 'initializing' ||
        status === 'scanning';

    return (
        <div className="min-h-screen bg-[#f6f8fb] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
            <main className="mx-auto max-w-3xl">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    disabled={isProcessing}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowBackRoundedIcon fontSize="small" />
                    Back to profile
                </button>

                <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <header className="border-b border-slate-200 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
                                <VerifiedRoundedIcon />
                            </span>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-950">
                                    Verify profile picture
                                </h1>

                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    Complete a live FaceTec video selfie.
                                </p>
                            </div>
                        </div>
                    </header>

                    <section className="p-6">
                        {status === 'initializing' && (
                            <div className="grid justify-items-center py-12 text-center">
                                <span className="grid h-16 w-16 animate-pulse place-items-center rounded-full bg-teal-50 text-teal-700">
                                    <CameraswitchRoundedIcon
                                        fontSize="large"
                                    />
                                </span>

                                <h2 className="mt-5 text-xl font-black">
                                    Initializing FaceTec
                                </h2>

                                <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                                    Preparing the secure camera
                                    verification session.
                                </p>
                            </div>
                        )}

                        {status === 'scanning' && (
                            <div className="grid justify-items-center py-12 text-center">
                                <span className="grid h-16 w-16 animate-pulse place-items-center rounded-full bg-teal-50 text-teal-700">
                                    <CameraswitchRoundedIcon
                                        fontSize="large"
                                    />
                                </span>

                                <h2 className="mt-5 text-xl font-black">
                                    Face verification in progress
                                </h2>

                                <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                                    Follow the instructions shown in
                                    the FaceTec camera window.
                                </p>
                            </div>
                        )}

                        {status === 'completed' && (
                            <div className="grid justify-items-center py-8 text-center">
                                <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                                    <CheckCircleRoundedIcon
                                        fontSize="large"
                                    />
                                </span>

                                <h2 className="mt-5 text-2xl font-black text-emerald-700">
                                    Enrollment completed
                                </h2>

                                <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                                    FaceTec successfully completed
                                    the live video selfie session.
                                </p>

                                <div className="mt-6 w-full rounded-lg border border-slate-200 bg-slate-950 p-4 text-left text-sm text-slate-100">
                                    <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                                        {JSON.stringify(
                                            verificationResult,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-teal-600 px-6 text-sm font-black text-white transition hover:bg-teal-700"
                                >
                                    Return to profile
                                </button>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="grid justify-items-center py-8 text-center">
                                <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
                                    <ErrorRoundedIcon
                                        fontSize="large"
                                    />
                                </span>

                                <h2 className="mt-5 text-2xl font-black text-rose-700">
                                    Verification failed
                                </h2>

                                <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                                    {errorMessage}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleRetry}
                                    className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-teal-700"
                                >
                                    Try again
                                </button>
                            </div>
                        )}
                    </section>
                </article>
            </main>
        </div>
    );
};

export default VerifyProfilePicture;