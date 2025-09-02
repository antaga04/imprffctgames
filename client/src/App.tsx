import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Game from '@/pages/Game';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Ranking from '@/pages/Ranking';
import Register from '@/pages/Register';
import { AuthProvider } from '@/contexts/AuthProvider';
import PrivateRoute from '@/components/PrivateRoute';
import ConfirmEmail from '@/pages/ConfirmEmail';
import { TempScoreProvider } from './contexts/TempScoreProvider';
import ResendEmail from './pages/ResendEmail';
import RestorePassword from './pages/RestorePassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import DeleteAccount from './pages/DeleteAccount';

function App() {
    console.log(`
Hi there! 👋 I hope you like what you see here. Enjoy! 🚀
	 __
    (  )
	 ||
  	 ||
 ___|""|__.._
/____________\\
\\____________/~~~

- Art by Jens Reissenweber from ASCII Art Archive 
`);

    return (
        <BrowserRouter>
            <Toaster richColors position="top-center" />
            <TempScoreProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/ranking" element={<Ranking />} />
                        <Route path="/games/:id" element={<Game />} />
                        <Route path="/confirm-email" element={<ConfirmEmail />} />
                        <Route path="/resend-email" element={<ResendEmail />} />
                        <Route path="/restore-password" element={<RestorePassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/delete-account" element={<DeleteAccount />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AuthProvider>
            </TempScoreProvider>
        </BrowserRouter>
    );
}

export default App;
