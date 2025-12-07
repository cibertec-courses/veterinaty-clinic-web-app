import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>🐾 Veterinary Clinic</span>
      </div>
      <div className="navbar-menu">
        <Link 
          to="/" 
          className={`navbar-item ${isActive('/') ? 'active' : ''}`}
        >
          Propietarios
        </Link>
        <Link 
          to="/pets" 
          className={`navbar-item ${isActive('/pets') ? 'active' : ''}`}
        >
          Mascotas
        </Link>
        <Link 
          to="/appointments" 
          className={`navbar-item ${isActive('/appointments') ? 'active' : ''}`}
        >
          Citas
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;