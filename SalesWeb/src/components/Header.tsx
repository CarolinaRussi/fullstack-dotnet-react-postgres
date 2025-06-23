import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Header() {
  const { isAuthenticated, logout, userType, userName } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  const updateCartCount = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      const total = cart.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-teal-700 text-white p-4 flex justify-between items-center">
      <h1
        className="cursor-pointer hover:underline focus:outline-none"
        onClick={() => navigate("/")}
      >
        Home
      </h1>
      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/")}
      >
        SkyShop
      </h1>

      <nav className="space-x-4 flex items-center">
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 hover:underline focus:outline-none"
              >
                Olá, {userName || "Usuário"} <IoMdArrowDropdown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-teal-700 rounded shadow-lg z-10">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-teal-100"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-teal-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            {userType === "admin" && (
              <>
                <Link to="/products" className="hover:underline">
                  Produtos
                </Link>
                <Link to="/customers" className="hover:underline">
                  Clientes
                </Link>
              </>
            )}

          </>
        )}
        {isAuthenticated && (
          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:underline"
          >
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="bg-white text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        )}
      </nav>
    </header>
  );
}
