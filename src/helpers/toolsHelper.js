// SweetAlert2 dimuat secara lazy agar tidak membebani bundle awal (performa).
async function getSwal() {
  const { default: Swal } = await import("sweetalert2");
  return Swal;
}

const confirmButtonColor = "#1d4ed8";

export async function showSuccessDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({ icon: "success", title: "Berhasil", text: message, confirmButtonColor });
}

export async function showErrorDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({ icon: "error", title: "Gagal", text: message, confirmButtonColor });
}

export async function showWarningDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({ icon: "warning", title: "Perhatian", text: message, confirmButtonColor });
}

export async function showConfirmDialog(message, confirmText = "Ya") {
  const Swal = await getSwal();
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor,
    cancelButtonColor: "#475569",
  });
  return result.isConfirmed;
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
