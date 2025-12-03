import Swal from "sweetalert2";

const baseConfig = {
  confirmButtonColor: "#00a6a6",
  customClass: {
    popup: "alert-pill"
  }
};

export const alertaExito = (mensaje) =>
  Swal.fire({
    title: "Éxito",
    text: mensaje,
    icon: "success",
    ...baseConfig
  });

export const alertaError = (mensaje) =>
  Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    ...baseConfig
  });

export const alertaAdvertencia = (mensaje) =>
  Swal.fire({
    title: "Atención",
    text: mensaje,
    icon: "warning",
    ...baseConfig
  });

export const confirmarEliminar = () =>
  Swal.fire({
    title: "¿Eliminar contacto?",
    text: "Esta acción no se puede deshacer.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#e0000f",
    cancelButtonColor: "#4f7d85",
    ...baseConfig
  });