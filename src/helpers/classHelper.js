import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

export const btnPrimary = `${buttonBase} bg-blue-700 text-white hover:bg-blue-800`;
export const btnSecondary = `${buttonBase} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100`;
export const btnDanger = `${buttonBase} bg-rose-700 text-white hover:bg-rose-800`;
