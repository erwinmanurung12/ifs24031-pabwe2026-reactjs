import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconSearch, IconBellRinging, IconShieldCheck } from "@tabler/icons-react";

const highlights = [
  { icon: IconSearch, text: "Laporkan barang hilang atau temuan dalam hitungan detik" },
  { icon: IconBellRinging, text: "Pantau status laporan hingga barang kembali ke pemilik" },
  { icon: IconShieldCheck, text: "Data laporan Anda tersimpan aman di akun pribadi" },
];

export default function AuthLayout() {
  const isAuthLogin = useSelector((state) => state.isAuthLogin);

  if (isAuthLogin) return <Navigate to="/" replace />;

  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-blue-800 px-6 py-8 text-white lg:flex lg:flex-col lg:justify-center lg:px-14">
        <p className="flex items-center gap-3 text-xl font-extrabold">
          <img src="/logo.svg" alt="" width="40" height="40" />
          Lost &amp; Founds
        </p>
        <ul className="mt-8 hidden space-y-5 lg:block">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-blue-50">
              <Icon size={24} aria-hidden="true" className="mt-0.5 shrink-0 text-sky-300" />
              <span className="text-base leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
