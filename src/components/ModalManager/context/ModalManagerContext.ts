import { createContext } from 'react';
import IContext from '../model/IContext';

export const ModalManagerContext = createContext<IContext>({
    modalStack: [],
    pop: () => {
        throw new Error('ModalManager no context provided');
    },
    push: () => {
        throw new Error('ModalManager no context provided');
    },
});

export default ModalManagerContext;
