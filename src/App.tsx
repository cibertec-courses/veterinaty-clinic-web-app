import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OwnersPage from './pages/OwnersPage';
import PetsPage from './pages/PetsPage';
import AppointmentsPage from './pages/AppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <Navbar />
        <main className="w-full px-4 sm:px-6 lg:px-12 py-8">
          <Routes>
            <Route path="/" element={<OwnersPage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
