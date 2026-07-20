import { Link } from 'react-router-dom';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-3 text-slate-950">
                            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-600 text-white">
                                <ShieldOutlinedIcon fontSize="small" />
                            </span>
                            <span className="text-lg font-black tracking-tight">VerifyDesk</span>
                        </Link>
                        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                            A focused workspace for profile picture upload and identity verification.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Workspace</h2>
                        <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
                            <a href="#profile" className="transition hover:text-teal-700">Profile</a>
                            <a href="#upload" className="transition hover:text-teal-700">Photo upload</a>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Status</h2>
                        <div className="mt-4 grid gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-2">
                                <CheckCircleOutlineRoundedIcon className="text-emerald-600" fontSize="small" />
                                All systems operational
                            </span>
                            <span className="flex items-center gap-2">
                                <MailOutlineRoundedIcon className="text-slate-500" fontSize="small" />
                                support@verifydesk.test
                            </span>
                            <span className="flex items-center gap-2">
                                <LocationOnOutlinedIcon className="text-slate-500" fontSize="small" />
                                Built for distributed teams
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>Copyright {year} VerifyDesk. All rights reserved.</p>
                    <div className="flex gap-4 font-semibold">
                        <a href="#privacy" className="transition hover:text-slate-950">Privacy</a>
                        <a href="#terms" className="transition hover:text-slate-950">Terms</a>
                        <a href="#security" className="transition hover:text-slate-950">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
