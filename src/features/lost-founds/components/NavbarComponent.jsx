import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconMenu2, IconLogout } from "@tabler/icons-react";
import Avatar from "../../../components/Avatar";
import { asyncSetIsAuthLogout } from "../../auth/states/action";

export default function NavbarComponent({ onToggleSidebar, sidebarOpen }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka menu navigasi"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar-nav"
          className="rounded-lg p-2 text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <IconMenu2 size={24} aria-hidden="true" />
        </button>
        <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold text-slate-900">
          <img src="/logo.svg" alt="" width="32" height="32" />
          <span>Lost &amp; Founds</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-100">
            <Avatar name={profile?.name} photo={profile?.photo} />
            <span className="hidden max-w-40 truncate text-sm font-semibold text-slate-800 sm:inline">
              {profile?.name}
            </span>
            <span className="sr-only sm:hidden">Profil saya</span>
          </Link>
          <button
            type="button"
            onClick={() => dispatch(asyncSetIsAuthLogout())}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            <IconLogout size={18} aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
