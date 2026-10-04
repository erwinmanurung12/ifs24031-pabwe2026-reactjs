import { NavLink } from "react-router-dom";
import { IconHome, IconUsers, IconUserCircle } from "@tabler/icons-react";
import { cn } from "../../../helpers/classHelper";

const menus = [
  { to: "/", label: "Beranda", icon: IconHome, end: true },
  { to: "/users", label: "Pengguna", icon: IconUsers },
  { to: "/profile", label: "Profil Saya", icon: IconUserCircle },
];

export default function SidebarComponent({ open, onClose }) {
  return (
    <>
      {open && <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" />}
      <nav
        id="sidebar-nav"
        aria-label="Menu utama"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 pt-20 lg:sticky lg:top-16 lg:z-0 lg:block lg:h-[calc(100vh-4rem)] lg:pt-6",
          open ? "block" : "hidden"
        )}
      >
        <ul className="space-y-1">
          {menus.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold",
                    isActive ? "bg-blue-100 text-blue-900" : "text-slate-800 hover:bg-slate-100"
                  )
                }
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
