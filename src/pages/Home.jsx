import { useEffect, useRef, useState } from 'react';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useMe, useUploadProfilePicture } from '../hooks/adminHooks';

const MAX_PHOTO_SIZE = 6 * 1024 * 1024;
const SUPPORTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'U';

const Home = () => {
    const [photoPreview, setPhotoPreview] = useState('');
    const [fileError, setFileError] = useState('');
    const photoInputRef = useRef(null);
    const { data: user } = useMe();
    const uploadProfilePicture = useUploadProfilePicture();

    const profilePhotoUrl = photoPreview || user?.profilePicture?.url || '';
    const profileInitials = getInitials(user?.name);

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const resetInput = () => {
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
            setPhotoPreview('');
            setFileError('Only JPG, PNG, and WEBP profile pictures are supported.');
            resetInput();
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            setPhotoPreview('');
            setFileError('Profile picture must be 6MB or smaller.');
            resetInput();
            return;
        }

        setPhotoPreview(URL.createObjectURL(file));
        setFileError('');

        uploadProfilePicture.mutate(file, {
            onSuccess: () => {
                setPhotoPreview('');
                resetInput();
            },
            onError: () => {
                setPhotoPreview('');
                resetInput();
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
            <section id="profile" className="mx-auto flex max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <article className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-teal-50 text-teal-700">
                                <AccountCircleRoundedIcon />
                            </span>
                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-black tracking-tight text-slate-950">
                                    {user?.name || 'Your profile'}
                                </h1>
                                <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                                    {user?.email || 'Signed in user'}
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-black text-slate-600">
                            <ImageRoundedIcon fontSize="small" />
                            Profile picture
                        </span>
                    </div>

                    <div id="upload" className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
                        <div className="grid justify-items-center gap-4">
                            <div className="relative grid h-64 w-64 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner">
                                {profilePhotoUrl ? (
                                    <img
                                        src={profilePhotoUrl}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl font-black text-slate-400">
                                        {profileInitials}
                                    </span>
                                )}

                                {uploadProfilePicture.isPending && (
                                    <span className="absolute inset-0 grid place-items-center bg-slate-950/60 text-sm font-black text-white">
                                        Uploading...
                                    </span>
                                )}
                            </div>

                            <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-teal-700">
                                <CloudUploadRoundedIcon fontSize="small" />
                                Upload profile picture
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoChange}
                                    disabled={uploadProfilePicture.isPending}
                                    className="sr-only"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                                    Current image
                                </p>
                                <p className="mt-3 break-words text-lg font-black text-slate-950">
                                    {user?.profilePicture?.url ? 'Profile picture saved' : 'No profile picture uploaded'}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-500">
                                    JPG, PNG, or WEBP. Maximum file size: 6MB.
                                </p>
                            </div>

                            {fileError && (
                                <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
                                    {fileError}
                                </p>
                            )}

                            <button
                                type="button"
                                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-5 text-sm font-black text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-700"
                            >
                                <VerifiedRoundedIcon fontSize="small" />
                                Verify profile picture
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default Home;
