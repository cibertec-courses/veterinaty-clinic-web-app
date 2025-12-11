import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkBaseClass = "px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200";
  const linkActiveClass = "bg-blue-600 text-white shadow-lg";
  const linkInactiveClass = "text-gray-600 hover:bg-blue-600 hover:text-white";

  return (
    <nav className="bg-white shadow-md">
      <div className="flex items-center justify-between h-16 px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-blue-600">
            Veterinary Clinic
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`${linkBaseClass} ${isActive('/') ? linkActiveClass : linkInactiveClass}`}
          >
            Propietarios
          </Link>
          <Link
            to="/pets"
            className={`${linkBaseClass} ${isActive('/pets') ? linkActiveClass : linkInactiveClass}`}
          >
            Mascotas
          </Link>
          <Link
            to="/appointments"
            className={`${linkBaseClass} ${isActive('/appointments') ? linkActiveClass : linkInactiveClass}`}
          >
            Citas
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
