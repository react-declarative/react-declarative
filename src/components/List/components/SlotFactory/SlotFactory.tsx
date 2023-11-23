import * as React from 'react';
import { useContext, useMemo } from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext from './SlotContext';

interface ISlotFactoryProps extends Partial<ISlotFactoryContext> {
    children: React.ReactNode;
}

export const SlotFactory = ({
    children,
    ...currentSlots
}: Partial<ISlotFactoryProps>) => {
    const upperSlots = useContext(SlotContext);
    const value = useMemo(() => ({...upperSlots, ...currentSlots}), []);
    return (
        <SlotContext.Provider value={value}>
            {children}
        </SlotContext.Provider>
    );
};

export default SlotFactory;
