import { toast } from "react-toastify";

/**
 * Toast notification service for displaying messages to users
 */
const toastService = {
  /**
   * Display a success message
   * @param {string} message - The message to display
   */
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Display an error message
   * @param {string} message - The message to display
   */
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Display a warning message
   * @param {string} message - The message to display
   */
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Display an info message
   * @param {string} message - The message to display
   */
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
};

export default toastService;
