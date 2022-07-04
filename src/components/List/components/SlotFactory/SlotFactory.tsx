import * as React from 'react';
import { useContext } from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext from './SlotContext';

interface ISlotFactoryProps extends ISlotFactoryContext {
    children: React.ReactNode;
}

export const SlotFactory = ({
    children,
    ...currentSlots
}: Partial<ISlotFactoryProps>) => {
    const upperSlots = useContext(SlotContext);
    return (
        <SlotContext.Provider value={{...upperSlots, ...currentSlots}}>
            {children}
        </SlotContext.Provider>
    );
};

export default SlotFactory;
