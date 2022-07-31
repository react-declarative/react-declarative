import React from 'react';
import { createContext, useContext, useState } from 'react';

import { IListChip, ListHandlerChips } from '../../../model/IListProps';

import useProps from "./useProps";

const ChipsContext = createContext<IState>(null as never);

export const useChips = () => useContext(ChipsContext);

interface IChipsProviderProps {
    children: React.ReactNode;
    chips: IListChip[];
    chipData: ListHandlerChips;
}

interface IState {
    chips: Map<string, boolean>;
    setChips: (s: Map<string, boolean>) => void;
}

export const ChipsProvider = ({
    children,
    chips: upperChips,
    chipData,
}: IChipsProviderProps) => {
    const [chips, setChips] = useState(new Map<string, boolean>(
        upperChips.map(({ name: chip, enabled = false }) => [chip.toString(), chipData[chip] || enabled]),
    ));

    const {
        handleChips,
    } = useProps();

    const handleChipsChange = (chips: Map<string, boolean>) => {
        handleChips([...chips].reduce((acm, [k, v]) => ({...acm, [k]: v}), {}));
        setChips(new Map(chips));
    };

    const value = {
        chips,
        setChips: handleChipsChange,
    };

    return (
        <ChipsContext.Provider value={value}>
            {children}
        </ChipsContext.Provider>
    );
};

export default useChips;
