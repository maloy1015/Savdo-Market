import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileOrders from "./pages/ProfileOrders";
import ProfileAddresses from "./pages/ProfileAddresses";
import ProfilePayment from "./pages/ProfilePayment";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList mode="all" />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="addresses" element={<ProfileAddresses />} />
          <Route path="payment" element={<ProfilePayment />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPlaceholder title="To'lovlar" />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="addresses" element={<AdminPlaceholder title="Manzillar" />} />
        <Route path="analytics" element={<AdminPlaceholder title="Statistika" />} />
        <Route path="settings" element={<AdminPlaceholder title="Sozlamalar" />} />
      </Route>
    </Routes>
  );
}
