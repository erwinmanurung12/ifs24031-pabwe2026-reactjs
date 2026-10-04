import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconSearch } from "@tabler/icons-react";
import Avatar from "../../../components/Avatar";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { asyncSetUsers } from "../states/action";

export default function UsersPage() {
  useDocumentTitle("Pengguna");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [keyword, onKeywordChange] = useInput("");

  useEffect(() => {
    dispatch(asyncSetUsers());
  }, [dispatch]);

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query));
  }, [users, keyword]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Daftar pengguna</h1>
        <p className="mt-1 text-slate-700">Semua pengguna yang terdaftar di aplikasi.</p>
      </div>
      <div className="relative">
        <label htmlFor="user-search" className="sr-only">
          Cari pengguna
        </label>
        <IconSearch size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          id="user-search"
          type="search"
          value={keyword}
          onChange={onKeywordChange}
          placeholder="Cari nama atau email..."
          className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-500"
        />
      </div>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-700">
          Pengguna tidak ditemukan.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((user) => (
            <li key={user.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <Avatar name={user.name} photo={user.photo} className="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">{user.name}</p>
                <p className="truncate text-sm text-slate-700">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
