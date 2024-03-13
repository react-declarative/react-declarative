import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IFileSlot from './IFileSlot';

/**
 * Represents a file slot component.
 * @param props - The props for the file slot component.
 * @returns The rendered file slot component.
 */
export const FileSlot = (props: IFileSlot) => {
    const { File } = useContext(SlotContext);
    return <File {...props} />;
};

export default FileSlot;
