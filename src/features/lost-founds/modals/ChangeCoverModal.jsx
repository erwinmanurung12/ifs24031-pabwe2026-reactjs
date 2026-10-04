import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalShell from "../../../components/ModalShell";
import FormField from "../../../components/FormField";
import { btnPrimary, btnSecondary } from "../../../helpers/classHelper";
import { asyncChangeLostFoundCover } from "../states/action";

export default function ChangeCoverModal({ lostFoundId, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChangeCover);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(event) {
    const selected = event.target.files[0] ?? null;
    setError("");
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setError("Berkas harus berupa gambar");
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError("Pilih gambar terlebih dahulu");
      return;
    }
    const success = await dispatch(asyncChangeLostFoundCover({ id: lostFoundId, file }));
    if (success) onClose();
  }

  return (
    <ModalShell id="cover-modal" title="Ubah cover" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="cover-file"
          label="Pilih gambar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          error={error}
          hint="Gunakan foto yang jelas sebagai bukti barang."
        />
        {preview && (
          <img
            src={preview}
            alt="Pratinjau cover baru"
            width="480"
            height="270"
            className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
          />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Batal
          </button>
          <button type="submit" disabled={isChanging} className={btnPrimary}>
            {isChanging ? "Mengunggah..." : "Unggah cover"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
