import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalShell from "../../../components/ModalShell";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import { btnPrimary, btnSecondary } from "../../../helpers/classHelper";
import { asyncChangeLostFound } from "../states/action";

export default function ChangeModal({ lostFound, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChange);
  const [title, onTitleChange] = useInput(lostFound.title);
  const [description, onDescriptionChange] = useInput(lostFound.description);
  const [status, onStatusChange] = useInput(lostFound.status);
  const [isCompleted, setIsCompleted] = useState(Number(lostFound.is_completed) === 1);
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Judul wajib diisi";
    if (!description.trim()) nextErrors.description = "Deskripsi wajib diisi";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const success = await dispatch(
      asyncChangeLostFound({ id: lostFound.id, title: title.trim(), description: description.trim(), status, isCompleted })
    );
    if (success) onClose();
  }

  return (
    <ModalShell id="change-modal" title="Ubah laporan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="change-status" as="select" label="Jenis laporan" value={status} onChange={onStatusChange}>
          <option value="lost">Barang hilang</option>
          <option value="found">Barang ditemukan</option>
        </FormField>
        <FormField id="change-title" label="Judul" value={title} onChange={onTitleChange} error={errors.title} />
        <FormField
          id="change-description"
          as="textarea"
          rows={4}
          label="Deskripsi"
          value={description}
          onChange={onDescriptionChange}
          error={errors.description}
        />
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
          <input type="checkbox" checked={isCompleted} onChange={(event) => setIsCompleted(event.target.checked)} />
          Tandai laporan sudah selesai
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Batal
          </button>
          <button type="submit" disabled={isChanging} className={btnPrimary}>
            {isChanging ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
