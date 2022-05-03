import * as React from 'react';

import ISlotFactoryContext from './ISlotFactoryContext';

import SlotContext, { defaultSlots } from './SlotContext';

interface ISlotFactoryProps extends ISlotFactoryContext {
    children: React.ReactNode;
}

export const SlotFactory = ({
    children,
    ...currentSlots
}: Partial<ISlotFactoryProps>) => (
    <SlotContext.Provider value={{...defaultSlots, ...currentSlots}}>
        {children}
    </SlotContext.Provider>
);

export default SlotFactory;
