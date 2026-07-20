import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useMe } from './hooks/adminHooks';

//components
import Loader from './components/main/Loader';
const Protector = lazy(() => import('./components/main/Protector'));
const Layout = lazy(() => import('./components/main/Layout'));
const NotFound = lazy(() => import('./components/main/NotFound'));

//public
const Login = lazy(() => import('./pages/Login'));

//private
const Home = lazy(() => import('./pages/Home'));
const VerifyProfilePicture = lazy(() => import('./pages/VerifyProfilePicture'));


function App() {

    const { data: user, isLoading } = useMe();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <BrowserRouter>
            <Toaster />

            <Suspense fallback={<Loader />}>
                <Routes>

                    {/* private */}
                    <Route element={<Protector user={user} />}>
                        <Route path='/' element={<Layout><Home /></Layout>} />
                        <Route path='/verify-profile-picture' element={<Layout><VerifyProfilePicture /></Layout>} />
                    </Route>

                    {/* public */}
                    <Route element={<Protector user={user} reverse redirect="/" />}>
                        <Route path='/login' element={<Login />} />
                    </Route>

                    {/* both */}
                    <Route path='/loader' element={<Loader />} />

                    {/* not found */}
                    <Route path='*' element={<Layout><NotFound /></Layout>} />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
