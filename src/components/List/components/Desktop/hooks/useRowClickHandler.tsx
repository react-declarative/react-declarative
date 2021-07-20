import { useLayoutEffect, useState } from 'react';

import { useProps } from '../../PropProvider';

export const SKIP_ROW_CLICK = 'useRowClickHandler__skip-row-click';

const RENDERING_ZONE = '.MuiDataGrid-renderingZone';
const GRID_ROW = '.MuiDataGrid-row[data-id]';
const GRID_CELL = `.MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox)`;

export const useRowClickHandler = () => {

    const [ elementRef, setElementRef ] = useState<HTMLDivElement>();
    const listProps = useProps();

    useLayoutEffect(() => {

        let renderingZone = elementRef?.querySelector(RENDERING_ZONE);
        const elementMap = new Set<HTMLDivElement>();
        const { rows, onRowClick } = listProps;

        const clickHandler = (e: any) => {
            const { target } = e;
            const currentRow = target.closest(GRID_ROW);
            const currentCell = target.closest(GRID_CELL);
            const { id: targetId } = currentRow.dataset;
            const { length: skipRowClick } = currentCell.getElementsByClassName(SKIP_ROW_CLICK);
            const dataRow = rows.find(({id}) => id === targetId);
            !skipRowClick && onRowClick && onRowClick(dataRow);
        };

        const updateHandler = () => renderingZone?.querySelectorAll<HTMLDivElement>(GRID_ROW)
            .forEach((row) => {
                if (!elementMap.has(row)) {
                    elementMap.add(row);
                    row.querySelectorAll(GRID_CELL).forEach((cell) => {
                        cell.addEventListener('click', clickHandler)
                    });
                }
            });

        const observer = new MutationObserver(updateHandler);
        let subscribeTimeout: any = null;

        const handleSubscribe = () => {
            renderingZone = elementRef?.querySelector(RENDERING_ZONE);
            if (renderingZone) {
                observer.observe(renderingZone, {
                    childList: true,
                });
                updateHandler();
            } else {
                subscribeTimeout = setTimeout(handleSubscribe, 1_000);
            }
        };

        elementRef && handleSubscribe();

        return () => {
            observer.disconnect();
            if (subscribeTimeout !== null) {
                clearTimeout(subscribeTimeout);
            }
            elementMap.forEach((row) => row.querySelectorAll(GRID_CELL)
                .forEach((cell) => cell.removeEventListener('click', clickHandler)
            ));
            elementMap.clear();
        };

    }, [elementRef, listProps]);

    return (instance: HTMLDivElement) => {
        setElementRef(instance);
    };
};

export default useRowClickHandler;
