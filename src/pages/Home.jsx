import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import { useCreateVerificationSession } from '../hooks/verificationHooks';

const MAX_PHOTO_SIZE = 6 * 1024 * 1024;
const SUPPORTED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

const Home = () => {
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [consent, setConsent] = useState(false);
    const [fileError, setFileError] = useState('');
    const [activeVerificationId, setActiveVerificationId] = useState(() =>
        localStorage.getItem('activeVerificationId')
    );

    const photoInputRef = useRef(null);
    const createSession = useCreateVerificationSession();
    const readyToStart = Boolean(photoFile && consent) && !createSession.isPending;

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const clearPhoto = () => {
        setPhotoFile(null);
        setPhotoPreview('');
        setFileError('');

        if (photoInputRef.current) {
            photoInputRef.current.value = '';
        }
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!SUPPORTED_PHOTO_TYPES.includes(file.type)) {
            clearPhoto();
            setFileError('Only JPG, JPEG, and PNG photos are supported.');
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            clearPhoto();
            setFileError('Reference photo must be 6MB or smaller.');
            return;
        }

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setFileError('');
    };

    const startVerification = () => {
        if (!readyToStart) {
            return;
        }

        createSession.mutate(
            { photo: photoFile, consent },
            {
                onSuccess: ({ verificationId, videoLivenessUrl }) => {
                    localStorage.setItem('activeVerificationId', verificationId);
                    setActiveVerificationId(verificationId);
                    window.location.assign(videoLivenessUrl);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
            <section id="overview" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="border-b border-slate-200 pb-8">
                    <span className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                        <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                        Face verification
                    </span>
                    <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Match a reference photo with a Decentro video session.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                Upload a clear face photo, start the hosted check, and return here for the match decision.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={startVerification}
                            disabled={!readyToStart}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                        >
                            <OpenInNewRoundedIcon fontSize="small" />
                            {createSession.isPending ? 'Starting...' : 'Start verification'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_1fr_0.9fr] lg:px-8">
                <article id="photo" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-md bg-sky-50 text-sky-700">
                                <ImageSearchRoundedIcon />
                            </span>
                            <div>
                                <h2 className="text-lg font-black tracking-tight">Reference photo</h2>
                                <p className="text-sm text-slate-500">JPG, JPEG, or PNG</p>
                            </div>
                        </div>
                        {photoPreview && (
                            <button
                                type="button"
                                title="Remove photo"
                                onClick={clearPhoto}
                                className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                            >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                            </button>
                        )}
                    </div>

                    <label className="mt-5 grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 transition hover:border-teal-400 hover:bg-teal-50/40">
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handlePhotoChange}
                            className="sr-only"
                        />
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Reference preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="flex flex-col items-center gap-3 px-6 text-center">
                                <span className="grid h-14 w-14 place-items-center rounded-md bg-white text-teal-700 shadow-sm">
                                    <CloudUploadRoundedIcon />
                                </span>
                                <span className="text-sm font-black text-slate-700">Upload photo</span>
                                <span className="text-xs font-semibold text-slate-500">Maximum file size: 6MB</span>
                            </span>
                        )}
                    </label>

                    {fileError && (
                        <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
                            {fileError}
                        </p>
                    )}

                    <div className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm">
                        <p className="font-black text-slate-700">Photo input</p>
                        <p className="mt-1 truncate text-slate-500">{photoFile?.name || 'No photo selected'}</p>
                    </div>
                </article>

                <article id="video" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-violet-50 text-violet-700">
                            <VideocamRoundedIcon />
                        </span>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Video session</h2>
                            <p className="text-sm text-slate-500">Hosted by Decentro</p>
                        </div>
                    </div>

                    <div className="mt-5 grid aspect-[4/3] place-items-center rounded-lg border border-slate-200 bg-slate-950 px-6 text-center text-white">
                        <span className="flex flex-col items-center gap-3">
                            <span className="grid h-14 w-14 place-items-center rounded-md bg-white/10 text-teal-200">
                                <OpenInNewRoundedIcon />
                            </span>
                            <span className="text-sm font-black">External camera check</span>
                            <span className="max-w-xs text-xs font-semibold leading-5 text-slate-300">
                                Decentro opens in this tab and returns here with the result.
                            </span>
                        </span>
                    </div>

                    <label className="mt-4 flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(event) => setConsent(event.target.checked)}
                            className="mt-1 h-4 w-4 accent-teal-600"
                        />
                        <span>
                            <span className="block font-black">Customer consent</span>
                            <span className="mt-1 block leading-5 text-slate-500">
                                I consent to perform face verification for onboarding.
                            </span>
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={startVerification}
                        disabled={!readyToStart}
                        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                        <OpenInNewRoundedIcon fontSize="small" />
                        {createSession.isPending ? 'Starting session...' : 'Open Decentro session'}
                    </button>
                </article>

                <article id="result" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
                            <FactCheckRoundedIcon />
                        </span>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Verification result</h2>
                            <p className="text-sm text-slate-500">Face match decision</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-950">
                        <div className="grid min-h-52 place-items-center text-center">
                            <span>
                                <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-white text-slate-500 shadow-sm">
                                    <PendingActionsRoundedIcon />
                                </span>
                                <span className="mt-4 block text-lg font-black">
                                    {activeVerificationId ? 'Session in progress' : 'Waiting for session'}
                                </span>
                                <span className="mt-2 block text-sm font-semibold text-slate-500">
                                    {activeVerificationId
                                        ? 'Return from Decentro to refresh the final result.'
                                        : 'Upload a photo and provide consent to start.'}
                                </span>
                                {activeVerificationId && (
                                    <Link
                                        to={`/verification/return?verificationId=${activeVerificationId}`}
                                        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                                    >
                                        <FactCheckRoundedIcon fontSize="small" />
                                        View result
                                    </Link>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className={`rounded-md px-3 py-3 ${photoFile ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                            <p className="font-black">Photo</p>
                            <p className="mt-1 font-semibold">{photoFile ? 'Ready' : 'Missing'}</p>
                        </div>
                        <div className={`rounded-md px-3 py-3 ${consent ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                            <p className="font-black">Consent</p>
                            <p className="mt-1 font-semibold">{consent ? 'Given' : 'Required'}</p>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default Home;
