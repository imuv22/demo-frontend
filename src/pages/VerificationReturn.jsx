import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { refreshVerificationSessionApi } from '../apis/verificationApis';

const terminalStatuses = ['completed', 'failed'];

const decisionStyles = {
    same_person: {
        label: 'Same person',
        icon: CheckCircleRoundedIcon,
        panel: 'border-emerald-200 bg-emerald-50 text-emerald-950',
        badge: 'bg-emerald-600 text-white',
        message: 'The uploaded photo and Decentro video matched.',
    },
    different_person: {
        label: 'Different person',
        icon: ErrorOutlineRoundedIcon,
        panel: 'border-rose-200 bg-rose-50 text-rose-950',
        badge: 'bg-rose-600 text-white',
        message: 'The uploaded photo and Decentro video did not meet the match threshold.',
    },
    needs_review: {
        label: 'Needs review',
        icon: ReportProblemRoundedIcon,
        panel: 'border-amber-200 bg-amber-50 text-amber-950',
        badge: 'bg-amber-600 text-white',
        message: 'Decentro returned an incomplete or ambiguous result.',
    },
    failed: {
        label: 'Failed',
        icon: ErrorOutlineRoundedIcon,
        panel: 'border-rose-200 bg-rose-50 text-rose-950',
        badge: 'bg-rose-600 text-white',
        message: 'The verification could not be completed.',
    },
};

const pendingStyle = {
    label: 'Pending',
    icon: PendingActionsRoundedIcon,
    panel: 'border-slate-200 bg-slate-50 text-slate-950',
    badge: 'bg-slate-700 text-white',
    message: 'Waiting for Decentro to publish the final result.',
};

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || 'Something went wrong';

const isTerminal = (verification) =>
    verification && terminalStatuses.includes(verification.status);

const formatPercent = (value) => {
    if (typeof value !== 'number') {
        return 'Pending';
    }

    return `${Math.round(value * 100) / 100}%`;
};

const formatRisk = (value) => {
    if (value === true) {
        return 'Risk found';
    }

    if (value === false) {
        return 'Clear';
    }

    return 'Pending';
};

const VerificationReturn = () => {
    const [searchParams] = useSearchParams();
    const verificationId = searchParams.get('verificationId');

    const resultQuery = useQuery({
        queryKey: ['verification-return', verificationId],
        queryFn: () => refreshVerificationSessionApi(verificationId),
        enabled: Boolean(verificationId),
        refetchInterval: (query) => (isTerminal(query.state.data) ? false : 4000),
        retry: (failureCount, error) => {
            const status = error.response?.status;
            return (!status || status >= 500) && failureCount < 2;
        },
    });

    const verification = resultQuery.data;
    const meta = decisionStyles[verification?.decision] || pendingStyle;
    const ResultIcon = meta.icon || FactCheckRoundedIcon;
    const loading = resultQuery.isLoading || resultQuery.isFetching;

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
            <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="border-b border-slate-200 pb-8">
                    <span className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                        <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                        Verification return
                    </span>
                    <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Decentro verification result.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                The result refreshes automatically while Decentro finishes processing.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => resultQuery.refetch()}
                            disabled={!verificationId || loading}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                        >
                            <RefreshRoundedIcon fontSize="small" className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:px-8">
                <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
                            <ResultIcon />
                        </span>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Face match decision</h2>
                            <p className="text-sm text-slate-500">Photo to hosted video</p>
                        </div>
                    </div>

                    {!verificationId ? (
                        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
                            <p className="text-lg font-black">Missing verification id</p>
                            <p className="mt-2 text-sm font-semibold">Start a new verification session from the home page.</p>
                        </div>
                    ) : resultQuery.isError ? (
                        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
                            <p className="text-lg font-black">Unable to fetch result</p>
                            <p className="mt-2 text-sm font-semibold">{getErrorMessage(resultQuery.error)}</p>
                        </div>
                    ) : (
                        <div className={`mt-5 rounded-lg border p-5 ${meta.panel}`}>
                            <span className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-black ${meta.badge}`}>
                                <ResultIcon fontSize="small" />
                                {meta.label}
                            </span>
                            <p className="mt-6 text-5xl font-black tracking-tight">
                                {formatPercent(verification?.matchScore)}
                            </p>
                            <p className="mt-3 text-sm leading-6">{meta.message}</p>

                            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                                <div className="rounded-md bg-white/70 px-3 py-3">
                                    <p className="font-black">Liveness</p>
                                    <p className="mt-1 truncate opacity-75">{verification?.liveness || 'Pending'}</p>
                                </div>
                                <div className="rounded-md bg-white/70 px-3 py-3">
                                    <p className="font-black">Static risk</p>
                                    <p className="mt-1 truncate opacity-75">{formatRisk(verification?.staticRisk)}</p>
                                </div>
                                <div className="rounded-md bg-white/70 px-3 py-3">
                                    <p className="font-black">Replay risk</p>
                                    <p className="mt-1 truncate opacity-75">{formatRisk(verification?.prerecordedRisk)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-sky-50 text-sky-700">
                            <FactCheckRoundedIcon />
                        </span>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Session details</h2>
                            <p className="text-sm text-slate-500">Provider response</p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm">
                        <div className="rounded-md bg-slate-50 px-3 py-3">
                            <p className="font-black text-slate-700">Status</p>
                            <p className="mt-1 break-words text-slate-500">{verification?.status || 'Pending'}</p>
                        </div>
                        <div className="rounded-md bg-slate-50 px-3 py-3">
                            <p className="font-black text-slate-700">Decentro txn id</p>
                            <p className="mt-1 break-words text-slate-500">{verification?.decentroTxnId || 'Pending'}</p>
                        </div>
                        <div className="rounded-md bg-slate-50 px-3 py-3">
                            <p className="font-black text-slate-700">Response</p>
                            <p className="mt-1 break-words text-slate-500">
                                {verification?.responseKey || verification?.responseCode || 'Pending'}
                            </p>
                        </div>
                        {verification?.message && (
                            <div className="rounded-md bg-slate-50 px-3 py-3">
                                <p className="font-black text-slate-700">Message</p>
                                <p className="mt-1 break-words text-slate-500">{verification.message}</p>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/"
                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-black text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                    >
                        <FactCheckRoundedIcon fontSize="small" />
                        New verification
                    </Link>
                </aside>
            </section>
        </div>
    );
};

export default VerificationReturn;
