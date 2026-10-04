# ifs24031-pabwe2026-reactjs

Aplikasi **Lost & Founds** (ReactJS + JavaScript, Vite, Redux Toolkit, Tailwind CSS v4).
Sumber data: `https://open-api.delcom.org/api/v1`.

## Menjalankan

```bash
bun install
bun run dev              # http://localhost:3000 (port dari APP_PORT)
bun run test:coverage    # target 100%
bun run build
```

Salin `.env.example` menjadi `.env` bila ingin mengubah `VITE_DELCOM_BASEURL` / `APP_PORT`
(tanpa `.env`, otomatis memakai `https://open-api.delcom.org/api/v1`).

## Deploy (wajib untuk Delcom Grading, localhost tidak diizinkan)

1. Push proyek ke GitHub (repo `ifs24031-pabwe2026-reactjs`).
2. Import ke Vercel dengan **nama project `ifs24031-pabwe2026-reactjs`**
   -> URL `https://ifs24031-pabwe2026-reactjs.vercel.app` (sesuai "Batas Prefix URL").
3. Framework preset: Vite. Build command `bun run build` (atau `npm run build`), output `dist`.
4. `vercel.json` sudah menangani SPA fallback (refresh di `/auth/login` tidak 404).

## Catatan audit (Lighthouse + axe)

- Halaman login/register: title, meta description, `lang="id"`, `robots.txt`, label form, landmark, fokus terlihat.
- Rute dashboard dan SweetAlert2 di-lazy-load; font Google dimuat non-blocking.
- Tes `src/a11y.test.jsx` menjalankan axe-core pada seluruh halaman.
