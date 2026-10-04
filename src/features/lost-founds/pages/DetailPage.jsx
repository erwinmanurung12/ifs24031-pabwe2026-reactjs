import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconArrowLeft, IconEdit, IconPhoto, IconTrash, IconPhotoOff } from "@tabler/icons-react";
import StatusBadge from "../../../components/StatusBadge";
import Avatar from "../../../components/Avatar";
import Spinner from "../../../components/Spinner";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { getAssetUrl } from "../../../helpers/apiHelper";
import { btnDanger, btnSecondary } from "../../../helpers/classHelper";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  asyncSetLostFound,
  asyncDeleteLostFound,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lostFound = useSelector((state) => state.lostFound);
  const profile = useSelector((state) => state.profile);
  const isChanged = useSelector((state) => state.isLostFoundChanged);
  const isChangedCover = useSelector((state) => state.isLostFoundChangedCover);
  const isDeleted = useSelector((state) => state.isLostFoundDeleted);
  const [showChange, setShowChange] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [loadedId, setLoadedId] = useState(null);

  const item = lostFound && String(lostFound.id) === id ? lostFound : null;
  useDocumentTitle(item ? item.title : "Detail laporan");

  useEffect(() => {
    let active = true;
    dispatch(asyncSetLostFound(id)).then(() => {
      if (active) setLoadedId(id);
    });
    return () => {
      active = false;
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!isChanged) return;
    dispatch(setIsLostFoundChangedActionCreator(false));
    dispatch(asyncSetLostFound(id));
  }, [dispatch, isChanged, id]);

  useEffect(() => {
    if (!isChangedCover) return;
    dispatch(setIsLostFoundChangedCoverActionCreator(false));
    setCoverFailed(false);
    dispatch(asyncSetLostFound(id));
  }, [dispatch, isChangedCover, id]);

  useEffect(() => {
    if (!isDeleted) return;
    dispatch(setIsLostFoundDeletedActionCreator(false));
    navigate("/");
  }, [dispatch, isDeleted, navigate]);

  async function handleDelete() {
    const confirmed = await showConfirmDialog("Laporan ini akan dihapus permanen. Lanjutkan?", "Ya, hapus");
    if (confirmed) dispatch(asyncDeleteLostFound(id));
  }

  const backLink = (
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline">
      <IconArrowLeft size={18} aria-hidden="true" />
      Kembali ke beranda
    </Link>
  );

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {backLink}
        {loadedId !== id ? (
          <Spinner label="Memuat detail..." />
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-700">
            Laporan tidak ditemukan.
          </p>
        )}
      </div>
    );
  }

  const cover = getAssetUrl(item.cover);
  const isOwner = profile?.id === item.user_id;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {backLink}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {cover && !coverFailed ? (
          <img
            src={cover}
            alt={`Foto ${item.title}`}
            width="768"
            height="432"
            onError={() => setCoverFailed(true)}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-700">
            <IconPhotoOff size={40} aria-hidden="true" />
            <span className="text-sm">Belum ada foto</span>
          </div>
        )}
        <div className="space-y-4 p-5 sm:p-6">
          <StatusBadge status={item.status} isCompleted={Number(item.is_completed) === 1} />
          <h1 className="text-2xl font-extrabold text-slate-900">{item.title}</h1>
          <div className="flex items-center gap-3">
            <Avatar name={item.author.name} photo={item.author.photo} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.author.name}</p>
              <p className="text-xs text-slate-600">Dilaporkan {formatDate(item.created_at)}</p>
            </div>
          </div>
          <p className="whitespace-pre-line text-slate-800">{item.description}</p>

          {isOwner && (
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
              <button type="button" onClick={() => setShowCover(true)} className={btnSecondary}>
                <IconPhoto size={18} aria-hidden="true" />
                Ubah cover
              </button>
              <button type="button" onClick={() => setShowChange(true)} className={btnSecondary}>
                <IconEdit size={18} aria-hidden="true" />
                Ubah data
              </button>
              <button type="button" onClick={handleDelete} className={btnDanger}>
                <IconTrash size={18} aria-hidden="true" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </article>

      {showChange && <ChangeModal lostFound={item} onClose={() => setShowChange(false)} />}
      {showCover && <ChangeCoverModal lostFoundId={item.id} onClose={() => setShowCover(false)} />}
    </div>
  );
}
