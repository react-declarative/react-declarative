import React from 'react';
import { createContext, useContext, useState } from 'react';

import { IListChip, ListHandlerChips } from '../../../model/IListProps';

import useProps from "./useProps";

const ChipsContext = createContext<IState>(null as never);

/**
 * Retrieves the context value from the 'ChipsContext' using the useContext hook.
 *
 * @returns The context value obtained from the 'ChipsContext'.
 */
export const useChips = () => useContext(ChipsContext);

/**
 * Interface representing the props for the ChipsProvider component.
 */
interface IChipsProviderProps {
    children: React.ReactNode;
    chips: IListChip[];
    chipData: ListHandlerChips;
}

/**
 * Represents the state of a system.
 * @interface IState
 */
interface IState {
    chips: Map<string, boolean>;
    setChips: (s: Map<string, boolean>) => void;
}

/**
 * Provides chips functionality to its children components.
 *
 * @typedef {Object} IChipsProviderProps
 * @property {ReactNode} children - The children components of the ChipsProvider.
 * @property {Array<{ name: string, enabled?: boolean }>} chips - The array of chips with their initial enabled state.
 * @property {Object} chipData - The object containing chip data where the key is the chip name and the value is the chip data.
 */
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

    /**
     * Callback function to handle changes in the `chips` variable.
     *
     * @param chips - The updated chips data represented as a Map.
     * @returns
     */
    const handleChipsChange = (chips: Map<string, boolean>) => {
        handleChips([...chips].reduce((acm, [k, v]) => ({...acm, [k]: v}), {}));
        setChips(new Map(chips));
    };

    /**
     * Represents a set of chips and its associated change handler.
     *
     * @typedef {Object} ChipsWithChangeHandler
     * @property {Array} chips - The array of chips.
     * @property {Function} setChips - The function to handle changes to the chips.
     */
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
