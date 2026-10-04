import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { btnPrimary } from "../../../helpers/classHelper";
import {
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "../states/action";

export default function ProfilePage() {
  useDocumentTitle("Profil Saya");
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const isChangeProfile = useSelector((state) => state.isChangeProfile);
  const isChangePhoto = useSelector((state) => state.isChangeProfilePhoto);
  const isChangePassword = useSelector((state) => state.isChangeProfilePassword);

  const [name, onNameChange] = useInput(profile.name);
  const [email, onEmailChange] = useInput(profile.email);
  const [profileErrors, setProfileErrors] = useState({});

  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const [password, onPasswordChange, setPassword] = useInput("");
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput("");
  const [passwordErrors, setPasswordErrors] = useState({});

  function handleProfileSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = "Nama wajib diisi";
    if (!email.trim()) errors.email = "Email wajib diisi";
    setProfileErrors(errors);
    if (Object.keys(errors).length) return;
    dispatch(asyncChangeProfile({ name: name.trim(), email: email.trim() }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files[0] ?? null;
    setPhoto(file);
    setPhotoError("");
  }

  function handlePhotoSubmit(event) {
    event.preventDefault();
    if (!photo) {
      setPhotoError("Pilih foto terlebih dahulu");
      return;
    }
    dispatch(asyncChangeProfilePhoto(photo));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!password) errors.password = "Kata sandi saat ini wajib diisi";
    if (newPassword.length < 6) errors.newPassword = "Kata sandi baru minimal 6 karakter";
    setPasswordErrors(errors);
    if (Object.keys(errors).length) return;
    const success = await dispatch(asyncChangeProfilePassword({ password, newPassword }));
    if (success) {
      setPassword("");
      setNewPassword("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Profil saya</h1>

      <section aria-labelledby="photo-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 id="photo-heading" className="text-lg font-bold text-slate-900">
          Foto profil
        </h2>
        <form onSubmit={handlePhotoSubmit} noValidate className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} photo={profile.photo} className="h-16 w-16" />
            <div className="flex-1">
              <FormField id="photo" label="Pilih foto" type="file" accept="image/*" onChange={handlePhotoChange} error={photoError} />
            </div>
          </div>
          <button type="submit" disabled={isChangePhoto} className={btnPrimary}>
            Unggah foto
          </button>
        </form>
      </section>

      <section aria-labelledby="info-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 id="info-heading" className="text-lg font-bold text-slate-900">
          Informasi akun
        </h2>
        <form onSubmit={handleProfileSubmit} noValidate className="mt-4 space-y-4">
          <FormField id="profile-name" label="Nama lengkap" autoComplete="name" value={name} onChange={onNameChange} error={profileErrors.name} />
          <FormField id="profile-email" label="Email" type="email" autoComplete="email" value={email} onChange={onEmailChange} error={profileErrors.email} />
          <button type="submit" disabled={isChangeProfile} className={btnPrimary}>
            Simpan perubahan
          </button>
        </form>
      </section>

      <section aria-labelledby="password-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 id="password-heading" className="text-lg font-bold text-slate-900">
          Ubah kata sandi
        </h2>
        <form onSubmit={handlePasswordSubmit} noValidate className="mt-4 space-y-4">
          <FormField
            id="current-password"
            label="Kata sandi saat ini"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={onPasswordChange}
            error={passwordErrors.password}
          />
          <FormField
            id="new-password"
            label="Kata sandi baru"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={onNewPasswordChange}
            error={passwordErrors.newPassword}
          />
          <button type="submit" disabled={isChangePassword} className={btnPrimary}>
            Ubah kata sandi
          </button>
        </form>
      </section>
    </div>
  );
}
