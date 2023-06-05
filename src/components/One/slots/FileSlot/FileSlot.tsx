import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IFileSlot from './IFileSlot';

export const FileSlot = (props: IFileSlot) => {
    const { File } = useContext(SlotContext);
    return <File {...props} />;
};

export default FileSlot;
