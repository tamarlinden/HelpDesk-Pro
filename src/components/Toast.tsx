import { createContext, useContext, useCallback, type ReactNode } from 'react';
import Swal from 'sweetalert2';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

interface ConfirmOptions {
    title: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    
    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const bgColor = {
            success: 'linear-gradient(135deg, #449EA1 0%, #449EA1 100%)',
            error: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            info: 'linear-gradient(135deg, #449EA1 0%, #449EA1 100%)'
        };

        const iconColor = {
            success: '#ffffff',
            error: '#ffffff',
            info: '#ffffff'
        };

        const iconEmoji = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        Swal.fire({
            text: message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            background: bgColor[type],
            color: '#fff',
            padding: '12px 20px',
            width: 'auto',
            showClass: {
                popup: 'swal2-show'
            },
            hideClass: {
                popup: 'swal2-hide'
            },
            customClass: {
                popup: 'mini-toast',
                timerProgressBar: 'mini-toast-progress'
            }
        });
    }, []);

    const showConfirm = useCallback(async (options: ConfirmOptions): Promise<boolean> => {
        const result = await Swal.fire({
            html: `
                <div>
                    <div>👋</div>
                    <h3>${options.title}</h3>
                    <p>${options.text || ''}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'אישור',
            cancelButtonText: options.cancelText || 'ביטול',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                popup: 'confirm-popup',
                confirmButton: 'confirm-btn-yes',
                cancelButton: 'confirm-btn-no',
                actions: 'confirm-actions'
            }
        });

        return result.isConfirmed;
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showConfirm }}>
            {children}
        </ToastContext.Provider>
    );
};
