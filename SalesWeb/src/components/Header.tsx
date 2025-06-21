import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, logout, userType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-teal-700 text-white p-4 flex justify-between">
      <h1 className="font-bold">SalesApp</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Registrar
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:underline">
              Perfil
            </Link>
            {userType === "admin" && (
              <Link to="/products" className="hover:underline">
                Produtos
              </Link>
            )}
            <button onClick={handleLogout} className="hover:underline">
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
