import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalShell from "../../../components/ModalShell";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import { btnPrimary, btnSecondary } from "../../../helpers/classHelper";
import { asyncAddLostFound } from "../states/action";

export default function AddModal({ onClose }) {
  const dispatch = useDispatch();
  const isAdding = useSelector((state) => state.isLostFoundAdd);
  const [title, onTitleChange] = useInput("");
  const [description, onDescriptionChange] = useInput("");
  const [status, onStatusChange] = useInput("lost");
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Judul wajib diisi";
    if (!description.trim()) nextErrors.description = "Deskripsi wajib diisi";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const success = await dispatch(asyncAddLostFound({ title: title.trim(), description: description.trim(), status }));
    if (success) onClose();
  }

  return (
    <ModalShell id="add-modal" title="Tambah laporan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-slate-800">Jenis laporan</legend>
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input type="radio" name="status" value="lost" checked={status === "lost"} onChange={onStatusChange} />
              Barang hilang
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input type="radio" name="status" value="found" checked={status === "found"} onChange={onStatusChange} />
              Barang ditemukan
            </label>
          </div>
        </fieldset>
        <FormField id="add-title" label="Judul" value={title} onChange={onTitleChange} error={errors.title} placeholder="Contoh: Dompet cokelat" />
        <FormField
          id="add-description"
          as="textarea"
          rows={4}
          label="Deskripsi"
          value={description}
          onChange={onDescriptionChange}
          error={errors.description}
          placeholder="Ciri-ciri barang, lokasi, dan waktu kejadian"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Batal
          </button>
          <button type="submit" disabled={isAdding} className={btnPrimary}>
            {isAdding ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
