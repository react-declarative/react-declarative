import * as React from 'react';
import { useMemo } from 'react';

import { Selector } from "../components/Selector";

import useChange from '../../../hooks/useChange';
import useActualValue from '../../../hooks/useActualValue';
import useReloadTrigger from '../../../hooks/useReloadTrigger';

import debounce from '../../../utils/hof/debounce';
import isValidCord from '../utils/isValidCord';

import ICord, { ICordInternal } from '../model/ICord';

const CHANGE_DEBOUNCE = 100;

interface IContentProps {
    src: string;
    readonly: boolean;
    cords: ICord[];
    naturalHeight: number;
    naturalWidth: number;
    onChange: (cords: ICord[]) => void;
    onClick: (e: MouseEvent, id: string) => void;
    onHover: (e: MouseEvent, id: string) => void;
}

export const Content = ({
    src = 'image.png',
    readonly,
    cords = [],
    naturalHeight = 100,
    naturalWidth = 100,
    onChange = (cords) => console.log({ cords }),
    onClick,
    onHover,
}: IContentProps) => {

    const cords$ = useActualValue(cords);

    const { reloadTrigger, doReload } = useReloadTrigger();

    useChange(doReload, [readonly]);

    const handleChange = useMemo(() => debounce((change: ICordInternal) => {
        onChange(cords$.current.map((cord) => cord.id === change.id ? {
            ...change,
            color: cord.color,
            label: cord.label,
        } : cord));
    }, CHANGE_DEBOUNCE), []);

    return (
        <Selector
            key={reloadTrigger}
            cords={cords}
            readonly={readonly}
            src={src}
            id={src}
            naturalHeight={naturalHeight}
            naturalWidth={naturalWidth}
            onChange={(cord) => {
                if (!isValidCord(cord)) {
                    doReload();
                    return;
                }
                handleChange(cord);
            }}
            onClick={onClick}
            onHover={onHover}
        />
    );
};

export default Content;
