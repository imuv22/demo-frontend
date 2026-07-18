import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useLogin, useSignup } from '../hooks/adminHooks';

const emptyForm = {
    name: '',
    email: '',
    password: '',
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const navigate = useNavigate();
    const login = useLogin();
    const signup = useSignup();

    const isSubmitting = login.isPending || signup.isPending;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = isSignup
            ? form
            : { email: form.email, password: form.password };
        const mutation = isSignup ? signup : login;

        mutation.mutate(payload, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
    };

    const toggleMode = () => {
        setIsSignup((current) => !current);
        setForm(emptyForm);
    };

    return (
        <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
                    <div className="w-full max-w-md">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-600 text-white shadow-sm shadow-teal-900/20">
                                <ShieldOutlinedIcon />
                            </span>
                            <span>
                                <span className="block text-xl font-black tracking-tight">VerifyDesk</span>
                                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                    {isSignup ? 'Secure signup' : 'Secure sign in'}
                                </span>
                            </span>
                        </Link>

                        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">
                                    {isSignup ? 'Create account' : 'Welcome back'}
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {isSignup
                                        ? 'Create your account and start verification work.'
                                        : 'Access the review console and continue verification work.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                {isSignup && (
                                    <label className="block">
                                        <span className="text-sm font-black text-slate-700">Name</span>
                                        <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:bg-white">
                                            <PersonRoundedIcon className="text-slate-400" fontSize="small" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                minLength={2}
                                                maxLength={80}
                                                required={isSignup}
                                                placeholder="Your name"
                                                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                                            />
                                        </span>
                                    </label>
                                )}

                                <label className="block">
                                    <span className="text-sm font-black text-slate-700">Email address</span>
                                    <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:bg-white">
                                        <EmailRoundedIcon className="text-slate-400" fontSize="small" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="admin@verifydesk.test"
                                            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                                        />
                                    </span>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-black text-slate-700">Password</span>
                                    <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:bg-white">
                                        <LockRoundedIcon className="text-slate-400" fontSize="small" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            minLength={isSignup ? 8 : undefined}
                                            maxLength={72}
                                            required
                                            placeholder={isSignup ? 'At least 8 characters' : 'Enter password'}
                                            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                                        />
                                        <button
                                            type="button"
                                            title={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPassword((visible) => !visible)}
                                            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
                                        >
                                            {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                                        </button>
                                    </span>
                                </label>

                                {!isSignup && (
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <label className="flex items-center gap-2 font-semibold text-slate-600">
                                            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-teal-600" />
                                            Remember me
                                        </label>
                                        <a href="#reset" className="font-black text-teal-700 transition hover:text-teal-900">
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
                                    <ArrowForwardRoundedIcon fontSize="small" />
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={toggleMode}
                                className="mt-5 w-full text-center text-sm font-black text-teal-700 transition hover:text-teal-900"
                            >
                                {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="hidden overflow-hidden bg-slate-950 p-8 text-white lg:block">
                    <div className="flex h-full min-h-[640px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-200">
                                <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                                Trusted workspace
                            </span>
                            <h2 className="mt-8 max-w-xl text-5xl font-black tracking-tight">
                                Fast identity reviews with every signal in reach.
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-3xl bg-white p-5 text-slate-950">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-slate-500">Today</p>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Live</span>
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-3xl font-black">1.2k</p>
                                        <p className="text-xs font-bold text-slate-500">Approved</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black">42</p>
                                        <p className="text-xs font-bold text-slate-500">Pending</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black">9</p>
                                        <p className="text-xs font-bold text-slate-500">Flagged</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-3xl bg-teal-500 p-5">
                                    <p className="text-3xl font-black">98.6%</p>
                                    <p className="mt-2 text-sm font-bold text-teal-950">SLA health</p>
                                </div>
                                <div className="rounded-3xl bg-amber-300 p-5 text-slate-950">
                                    <p className="text-3xl font-black">4m</p>
                                    <p className="mt-2 text-sm font-bold">Median review</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;
