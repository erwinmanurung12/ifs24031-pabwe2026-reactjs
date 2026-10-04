import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { btnPrimary } from "../../../helpers/classHelper";
import { asyncSetIsAuthLogin } from "../states/action";

export default function LoginPage() {
  useDocumentTitle("Masuk");
  const dispatch = useDispatch();
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email wajib diisi";
    if (!password) nextErrors.password = "Kata sandi wajib diisi";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await dispatch(asyncSetIsAuthLogin({ email: email.trim(), password }));
    setLoading(false);
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold text-slate-900">Masuk ke akun Anda</h1>
      <p className="mt-2 text-slate-700">Kelola laporan barang hilang dan temuan Anda.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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
        <div>
          <FormField
            id="password"
            name="password"
            label="Kata sandi"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={onPasswordChange}
            error={errors.password}
          />
          <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-800">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Tampilkan kata sandi
          </label>
        </div>
        <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-700">
        Belum punya akun?{" "}
        <Link to="/auth/register" className="font-bold text-blue-700 underline">
          Daftar sekarang
        </Link>
      </p>
    </>
  );
}
