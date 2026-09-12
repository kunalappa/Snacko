import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../data/mockData';

interface ModalState {
    auth: {
        isOpen: boolean;
        mode: 'login' | 'signup';
        role: UserRole;
    };
    token: {
        isOpen: boolean;
        orderId: string | null;
    };
}

interface ModalContextType {
    isAuthModalOpen: boolean;
    authModalConfig: { mode: 'login' | 'signup'; role: UserRole };
    openAuthModal: (mode?: 'login' | 'signup', role?: UserRole) => void;
    closeAuthModal: () => void;

    isTokenModalOpen: boolean;
    tokenModalOrderId: string | null;
    openTokenModal: (orderId?: string | null) => void;
    closeTokenModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ModalState>({
        auth: { isOpen: false, mode: 'login', role: 'student' },
        token: { isOpen: false, orderId: null }
    });

    const openAuthModal = (mode: 'login' | 'signup' = 'login', role: UserRole = 'student') => {
        setState(prev => ({ ...prev, auth: { isOpen: true, mode, role } }));
    };

    const closeAuthModal = () => {
        setState(prev => ({ ...prev, auth: { ...prev.auth, isOpen: false } }));
    };

    const openTokenModal = (orderId: string | null = null) => {
        setState(prev => ({ ...prev, token: { isOpen: true, orderId } }));
    };

    const closeTokenModal = () => {
        setState(prev => ({ ...prev, token: { ...prev.token, isOpen: false } }));
    };

    return (
        <ModalContext.Provider value={{
            isAuthModalOpen: state.auth.isOpen,
            authModalConfig: { mode: state.auth.mode, role: state.auth.role },
            openAuthModal,
            closeAuthModal,
            isTokenModalOpen: state.token.isOpen,
            tokenModalOrderId: state.token.orderId,
            openTokenModal,
            closeTokenModal
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within a ModalProvider');
    return context;
};
