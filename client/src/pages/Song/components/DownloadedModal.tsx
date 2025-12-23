import React from 'react';
import { Link } from "react-router-dom";


interface DownloadedModalProps {
    isOpen: boolean;
    onClose: () => void;
    songName: string | null;
}

export const DownloadedModal: React.FC<DownloadedModalProps> = ({
    isOpen,
    onClose,
    songName
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative overflow-hidden max-w-lg w-11/12">
                <img
                    src="/images/logo-bg.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-auto opacity-20"
                />
                <div className="relative">
                    <h3 className="font-bold primary-color text-3xl mb-6">{songName ? `${songName} successfully downloaded` : "Successful Download"} 🎉</h3>
                    <p className='text-lg mb-6'>Congradulations, you have successfully downloaded {songName ? songName : "this song"}! You can view all the songs you have downloaded at <Link to="/account" className="text-blue-400 underline">my downloads</Link>.</p>
                </div>
            </div>
            <button className="modal-backdrop" onClick={onClose} aria-label="Close create account modal">
                Close
            </button>
        </div>
    )
}