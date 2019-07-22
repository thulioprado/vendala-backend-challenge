import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlert = withReactContent(Swal);

export const alert = async (props) => {
  return SweetAlert.fire({
    type: props.type,
    title: props.title,
    text: props.text,
    showConfirmButton: props.confirm,
    confirmButtonText: props.confirm,
    showCancelButton: props.cancel,
    cancelButtonText: props.cancel,
    showCloseButton: props.close
  });
}

export const toast = async (props) => {
  return SweetAlert.fire({
    toast: true,
    type: props.type,
    title: props.title,
    text: props.text,
    timer: 3000,
    position: 'top-end',
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: false
  });
}