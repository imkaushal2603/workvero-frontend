// utils/swal.js
import Swal from "sweetalert2";

const defaultConfig = {
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
};

export const confirmDialog = ({
  title = "Are you sure?",
  text = "You won't be able to undo this action.",
  icon = "warning",
  confirmButtonText = "Yes",
  cancelButtonText = "No",
} = {}) =>
  Swal.fire({
    ...defaultConfig,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
  });

export const successDialog = ({
  title = "Success",
  text = "Operation completed successfully.",
} = {}) =>
  Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#16a34a",
  });

export const errorDialog = ({
  title = "Error",
  text = "Something went wrong.",
} = {}) =>
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#dc2626",
  });

export const infoDialog = ({
  title = "Cancelled",
  text = "Operation cancelled.",
} = {}) =>
  Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonColor: "#3b82f6",
  });