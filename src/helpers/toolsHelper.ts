import Swal from "sweetalert2";

export const showSuccessDialog = (title: string, text: string) => {
  return Swal.fire({ icon: "success", title, text, confirmButtonColor: "#3085d6" });
};

export const showErrorDialog = (title: string, text: string) => {
  return Swal.fire({ icon: "error", title, text, confirmButtonColor: "#d33" });
};

export const showWarningDialog = (title: string, text: string) => {
  return Swal.fire({ icon: "warning", title, text, confirmButtonColor: "#f8bb86" });
};

export const showConfirmDialog = (title: string, text: string) => {
  return Swal.fire({ icon: "question", title, text, showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Ya", cancelButtonText: "Batal" });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
