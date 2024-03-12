import * as React from 'react';
import { useContext, useMemo } from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext from './SlotContext';

interface ISlotFactoryProps extends Partial<ISlotFactoryContext> {
    children: React.ReactNode;
}

/**
 * SlotFactory is a function component that wraps its children components with a SlotContext.Provider.
 * It merges the current slots with the upper slots and provides the merged slots to its descendants through the context.
 *
 * @param props - The properties for SlotFactory component.
 * @param props.children - The children components that will be wrapped by SlotFactory.
 * @param props.currentSlots - The current slots to be merged with the upper slots.
 * @returns The rendered SlotFactory component.
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
