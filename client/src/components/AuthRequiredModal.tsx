import React from 'react';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: () => void;
    onLogin: () => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
    isOpen,
    onClose,
    onRegister,
    onLogin,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative overflow-hidden max-w-2xl w-11/12">
                <img
                    src="/images/logo-bg.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-auto opacity-20"
                />
                <div className="relative">
                    <h3 className="font-bold text-3xl mb-3">Before you download.</h3>
                    <p className="py-4 text-lg text-color">
                        To download music tabs from{' '}
                        <span className="underline">superguitartab.com</span>,{' '}
                        you must create an account - it&apos;s free!
                    </p>
                    <div className="modal-action flex flex-col sm:flex-row sm:justify-end gap-2">
                        <button
                            className="btn secondary-color-bg surface-color w-full sm:w-auto"
                            onClick={onRegister}
                        >
                            Create account
                        </button>
                        <button
                            className="btn primary-color-bg surface-color w-full sm:w-auto"
                            onClick={onLogin}
                        >
                            I already have an account
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-backdrop" onClick={onClose} aria-label="Close create account modal">
                Close
            </button>
        </div>
    );
};


