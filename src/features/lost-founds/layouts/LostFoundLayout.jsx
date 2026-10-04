import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";
import Spinner from "../../../components/Spinner";
import { asyncSetProfile } from "../../users/states/action";
import { asyncSetIsAuthLogout } from "../../auth/states/action";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const isProfile = useSelector((state) => state.isProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route guarding: verifikasi token dengan memuat profil pengguna.
  useEffect(() => {
    if (!isAuthLogin) return;
    dispatch(asyncSetProfile()).then((success) => {
      if (!success) dispatch(asyncSetIsAuthLogout());
    });
  }, [dispatch, isAuthLogin]);

  if (!isAuthLogin) return <Navigate to="/auth/login" replace />;
  if (!isProfile) return <Spinner label="Memuat sesi..." />;

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Lewati ke konten utama
      </a>
      <NavbarComponent sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((value) => !value)} />
      <div className="lg:flex">
        <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
