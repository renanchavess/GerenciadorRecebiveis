import { createContext, useState } from "react";
import { Bounce, toast, ToastPosition } from "react-toastify";

interface NotifyContextProps {
    notify: { message: string, type: "success" | "error" };
    notification: (message: string, type: "success" | "error") => void;
}

export const NotifyContext = createContext<NotifyContextProps | undefined>(undefined);

export const NotifyProvider: React.FC = ({ children }) => {

    const config = {
        position: "top-center" as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    const notification = (message: string, type: "success" | "error") => {
        switch (type) {
            case 'success':
                showNotifySuccess(message);
                break;
            case 'error':
                showNotifyError(message);
                break;
            default:
                break;
        }
    };

    const showNotifyError = (message: string) => toast.error(message, config);
    const showNotifySuccess = (message: string) => toast.success(message, config);

    return (
        <NotifyContext.Provider value={{ notification }}>
            {children}
        </NotifyContext.Provider>
    );
};