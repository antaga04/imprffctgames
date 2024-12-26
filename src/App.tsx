import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Game from '@/pages/Game';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Ranking from '@/pages/Ranking';
import Register from '@/pages/Register';
import { AuthProvider } from '@/context/AuthContext';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster richColors position="top-center" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/games/:id" element={<Game />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
