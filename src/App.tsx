import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OwnersPage from './pages/OwnersPage';
import PetsPage from './pages/PetsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="container">
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