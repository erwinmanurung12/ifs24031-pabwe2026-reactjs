import { useState } from "react";
import { Link } from "react-router-dom";
import { IconPhotoOff } from "@tabler/icons-react";
import StatusBadge from "../../../components/StatusBadge";
import { getAssetUrl } from "../../../helpers/apiHelper";
import { formatDate } from "../../../helpers/toolsHelper";

export default function LostFoundCard({ item }) {
  const [failed, setFailed] = useState(false);
  const cover = getAssetUrl(item.cover);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {cover && !failed ? (
        <img
          src={cover}
          alt={`Foto ${item.title}`}
          width="400"
          height="225"
          loading="lazy"
          onError={() => setFailed(true)}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-slate-100 text-slate-600">
          <IconPhotoOff size={36} aria-hidden="true" />
          <span className="sr-only">Tidak ada foto</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <StatusBadge status={item.status} isCompleted={Number(item.is_completed) === 1} />
        <h3 className="text-base font-bold text-slate-900">
          <Link to={`/lost-founds/${item.id}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-slate-700">{item.description}</p>
        <p className="mt-auto pt-2 text-xs text-slate-600">
          {item.author.name} &middot; {formatDate(item.created_at)}
        </p>
      </div>
    </article>
  );
}
