
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Box } from "native-base";
import ToastComponent, { ToastStatus } from "../components/layout/Toast";

interface ToastItem {
    id: string;
    title: string;
    description?: string;
    status: ToastStatus;
}

interface ToastContextProps {
    showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextProps>({
    showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback(({
        title,
        description,
        status,
    }: Omit<ToastItem, "id">) => {
        const newToast = { id: title + Date.now(), title, description, status };
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 2500);
    }, []); 

    const contextValue = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <Box position="absolute" top={10} left={0} right={0} zIndex={999}>
                {toasts.map((toast) => (
                    <ToastComponent
                        key={toast.id}
                        title={toast.title}
                        description={toast.description}
                        status={toast.status}
                    />
                ))}
            </Box>
        </ToastContext.Provider>
    );
};

export const useCustomToast = () => useContext(ToastContext);