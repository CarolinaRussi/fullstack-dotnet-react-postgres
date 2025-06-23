import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Header from "../components/Header";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import AdminRoute from "./AdminRoute";
import ProductList from "../pages/Products";
import PublicRoute from "./PublicRoute";
import CustomerList from "../pages/Customer";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <ProductList />
            </AdminRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <AdminRoute>
              <CustomerList />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
