import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { btnPrimary } from "../../../helpers/classHelper";
import { asyncSetIsAuthRegister } from "../states/action";

export default function RegisterPage() {
  useDocumentTitle("Daftar");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Nama wajib diisi";
    if (!email.trim()) nextErrors.email = "Email wajib diisi";
    if (password.length < 6) nextErrors.password = "Kata sandi minimal 6 karakter";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    const success = await dispatch(asyncSetIsAuthRegister({ name: name.trim(), email: email.trim(), password }));
    setLoading(false);
    if (success) navigate("/auth/login");
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold text-slate-900">Buat akun baru</h1>
      <p className="mt-2 text-slate-700">Daftar untuk mulai melaporkan barang hilang dan temuan.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <FormField
          id="name"
          name="name"
          label="Nama lengkap"
          autoComplete="name"
          placeholder="Nama Anda"
          value={name}
          onChange={onNameChange}
          error={errors.name}
        />
        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={onEmailChange}
          error={errors.email}
        />
        <FormField
          id="password"
          name="password"
          label="Kata sandi"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
        />
        <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-700">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-bold text-blue-700 underline">
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
