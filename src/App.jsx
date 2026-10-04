import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import LostFoundLayout from "./features/lost-founds/layouts/LostFoundLayout";

// Rute dashboard & registrasi dimuat lazy agar bundle halaman login tetap kecil.
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage"));
const UsersPage = lazy(() => import("./features/users/pages/UsersPage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
