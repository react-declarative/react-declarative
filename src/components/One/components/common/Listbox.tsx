import * as React from 'react';
import { forwardRef } from 'react';

import VirtualView from '../../../VirtualView';

import useElementSize from '../../../../hooks/useElementSize';

interface IListBoxProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}

const MIN_ROW_HEIGHT = 54;
const MAX_POPUP_HEIGHT = 250;

export const ListBox = forwardRef(({
    children,
    role,
    ...other
}: IListBoxProps, ref: React.Ref<HTMLDivElement>) => {

    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const itemCount = Array.isArray(children) ? children.length : 0;

    return (
        <div ref={ref}>
            <div ref={elementRef} {...other}>
                <VirtualView
                    role={role}
                    sx={{
                        width: size.width,
                        height: itemCount
                            ? Math.min(itemCount * MIN_ROW_HEIGHT, MAX_POPUP_HEIGHT)
                            : MIN_ROW_HEIGHT,
                    }}
                    minRowHeight={MIN_ROW_HEIGHT}
                >
                    {children}
                </VirtualView>
            </div>
        </div>
    );
});

export default ListBox;
