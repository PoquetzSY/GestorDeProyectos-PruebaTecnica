import Swal from 'sweetalert2'

export const showToast = (icon, title, message) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    icon,
    title,
    text: message,
  })
}
