import { toast } from "react-toastify";

const configuration = {
  position: "bottom-left",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

const toasty = {
  success: (message, config) => toast.success(message, { ...configuration, ...config }),
  error: (message, config) => toast.error(message, { ...configuration, ...config }),
  warning: (message, config) => toast.warning(message, { ...configuration, ...config }),
  info: (message, config) => toast.info(message, { ...configuration, ...config }),
};

export default toasty

