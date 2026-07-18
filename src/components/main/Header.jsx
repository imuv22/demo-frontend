import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useLogout, useMe } from '../../hooks/adminHooks';

const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Photo', href: '#photo' },
    { label: 'Video', href: '#video' },
    { label: 'Result', href: '#result' },
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { data: user } = useMe();
    const logout = useLogout();

    const handleSignOut = () => {
        logout.mutate(undefined, {
            onSuccess: () => {
                setMenuOpen(false);
                navigate('/login', { replace: true });
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 text-slate-950">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-white shadow-sm shadow-teal-900/20">
                        <ShieldOutlinedIcon fontSize="small" />
                    </span>
                    <span>
                        <span className="block text-lg font-black tracking-tight">VerifyDesk</span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Identity Ops</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        title="Notifications"
                        className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
                    >
                        <NotificationsNoneRoundedIcon fontSize="small" />
                    </button>
                    <button
                        type="button"
                        title="Account"
                        className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
                    >
                        <AccountCircleRoundedIcon fontSize="small" />
                        {user?.name || 'Admin'}
                    </button>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-teal-700"
                    >
                        <LogoutRoundedIcon fontSize="small" />
                        Sign out
                    </button>
                </div>

                <button
                    type="button"
                    title="Toggle menu"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
                >
                    {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-2 shadow-xl shadow-slate-950/5 md:hidden">
                    <nav className="grid gap-2">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700"
                        >
                            <AccountCircleRoundedIcon fontSize="small" />
                            {user?.name || 'Admin'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-bold text-white"
                        >
                            <LogoutRoundedIcon fontSize="small" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
