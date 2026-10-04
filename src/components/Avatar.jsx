import { useState } from "react";
import { getAssetUrl } from "../helpers/apiHelper";
import { cn } from "../helpers/classHelper";

export default function Avatar({ name, photo, className }) {
  const [failed, setFailed] = useState(false);
  const url = getAssetUrl(photo);
  const sizeClass = cn("h-10 w-10 shrink-0 rounded-full", className);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        width="40"
        height="40"
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(sizeClass, "object-cover")}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(sizeClass, "inline-flex items-center justify-center bg-blue-100 text-sm font-bold text-blue-800")}
    >
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}
