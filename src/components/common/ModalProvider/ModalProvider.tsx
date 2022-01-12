import * as React from 'react';

import { ModalProvider as BaseModalProvider } from 'react-modal-hook';

import { ThemeProvider } from '../../../styles';

interface IModalProviderProps {
    children: React.ReactNode;
}

export const ModalProvider = ({
    children
}: IModalProviderProps) => (
    <ThemeProvider>
        <BaseModalProvider>
            {children}
        </BaseModalProvider>
    </ThemeProvider>
);

export default ModalProvider;
