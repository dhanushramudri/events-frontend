import { useState } from "react";

export const useToast = () => {
  // State for managing toast notifications
  const [toasts, setToasts] = useState([]);

  // Function to trigger a new toast
  const toast = ({ title, description, variant = "default" }) => {
    const newToast = { id: Date.now(), title, description, variant };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove the toast after a timeout (e.g., 5 seconds)
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== newToast.id)
      );
    }, 5000);
  };

  // Render toasts (you could adjust this rendering logic as per your needs)
  const renderToasts = () => {
    return toasts.map((toast) => (
      <div
        key={toast.id}
        className={`fixed bottom-4 right-4 w-72 p-4 rounded-lg shadow-lg ${getToastStyle(
          toast.variant
        )}`}
      >
        <h3 className="font-semibold">{toast.title}</h3>
        <p>{toast.description}</p>
      </div>
    ));
  };

  // Function to get styles based on variant
  const getToastStyle = (variant) => {
    switch (variant) {
      case "destructive":
        return "bg-red-500 text-white";
      case "default":
        return "bg-gray-800 text-white";
      case "success":
        return "bg-green-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  return { toast, renderToasts };
};
