import * as React from 'react';
import { useContext, useMemo } from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext from './SlotContext';

interface ISlotFactoryProps extends Partial<ISlotFactoryContext> {
    children: React.ReactNode;
}

/**
 * SlotFactory - A factory function to create slots for a given SlotContext.
 *
 * @param props - The props for the SlotFactory.
 * @param props.children - The children to render within the SlotFactory.
 * @param props.currentSlots - The slots to be added/overridden within the SlotFactory.
 *
 * @returns The rendered children within the SlotFactory.
 */
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
