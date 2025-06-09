import React from 'react';
import { CgMenuLeft } from 'react-icons/cg';

type HamburgerButtonProps = {
    onClick: () => void;
};

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick }) => {
    return (
        <button className="cursor-pointer transition-all" onClick={onClick}>
            <CgMenuLeft size={25} />
        </button>
    );
};