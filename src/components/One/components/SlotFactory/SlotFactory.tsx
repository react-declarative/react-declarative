import * as React from 'react';
import { useContext, useMemo } from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext from './SlotContext';

/**
 * Represents the properties for the ISlotFactory component.
 * @interface
 */
interface ISlotFactoryProps extends Partial<ISlotFactoryContext> {
    children: React.ReactNode;
}

/**
 * SlotFactory function
 * @param param - Slots prop for SlotFactory
 * @param param.children - React node to be rendered as children
 * @returns React node containing the children with the provided slots
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
