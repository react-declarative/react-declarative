import * as React from 'react';
import { useMemo } from 'react';

import { Selector } from "../components/Selector";

import useActualValue from '../../../hooks/useActualValue';

import debounce from '../../../utils/hof/debounce';
import compareCords from '../utils/compareCords';
import cached from '../../../utils/hof/cached';

import ICord, { ICordInternal } from '../model/ICord';

const CHANGE_DEBOUNCE = 850;

interface IContentProps {
    src: string;
    readonly: boolean;
    cords: ICord[];
    naturalHeight: number;
    naturalWidth: number;
    onChange: (cords: ICord[]) => void;
    onClick: (e: MouseEvent, id: string) => void;
}

export const Content = ({
    src = 'image.png',
    readonly,
    cords = [],
    naturalHeight = 100,
    naturalWidth = 100,
    onChange = (cords) => console.log({ cords }),
    onClick,
}: IContentProps) => {

    const cords$ = useActualValue(cords);

    const handleChange = useMemo(() => debounce((change: ICordInternal) => {
        onChange(cords$.current.map((cord) => cord.id === change.id ? {
            ...change,
            color: cord.color,
            label: cord.label,
        } : cord));
    }, CHANGE_DEBOUNCE), []);

    const managedCords = useMemo(() => cached(
        ([cords1]: [ICord[]], [cords2]: [ICord[]]) => {
            return !compareCords(cords1, cords2);
        },
        (cords: ICord[]) => cords
    ), []);

    return (
        <Selector
            key={`${src}-${readonly}`}
            cords={managedCords(cords)}
            readonly={readonly}
            src={src}
            id={src}
            naturalHeight={naturalHeight}
            naturalWidth={naturalWidth}
            onChange={handleChange}
            onClick={onClick}
        />
    );
};

export default Content;
