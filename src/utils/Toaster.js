import toast from "react-hot-toast";


const commonToastOptions = {
    duration: 2500,
    style: {
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "0.9rem",
        borderRadius: "10px",
        padding: "12px 16px",
        color: "#111827",
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
};

export const successToast = (message = "Success", options = {}) => {
    toast.success(message, {
        ...commonToastOptions,
        iconTheme: {
            primary: "#6385F0",
            secondary: "#ffffff",
        },
        ...options,
    });
};

export const failedToast = (message = "Something went wrong", options = {}) => {
    toast.error(message, {
        ...commonToastOptions,
        iconTheme: {
            primary: "#F94343",
            secondary: "#ffffff",
        },
        ...options,
    });
};