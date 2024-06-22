import * as React from 'react';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';

import { makeStyles } from '../../../styles';
import { debounce } from '@mui/material';

import classNames from '../../../utils/classNames';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';

import { PickProp } from '../../../model/IManaged';

import Group, { IGroupProps } from "../../../components/common/Group";

import useElementSize from '../../../hooks/useElementSize';

import makeLayout from '../components/makeLayout/makeLayout';

const CENTER_DEBOUNCE = 250;

declare var ResizeObserver: any;

/**
 * Interface for defining props for the CenterLayout component.
 *
 * @template Data - The data type.
 * @template Payload - The payload type.
 * @extends IGroupProps<Data> - The props interface that the CenterLayoutProps extends.
 */
export interface ICenterLayoutProps<Data = IAnything, Payload = IAnything> extends IGroupProps<Data> {
    innerPadding?: PickProp<IField<Data, Payload>, 'innerPadding'>;
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
}

/**
 * Interface representing a private center layout entity.
 * @template Data - The type of data associated with the entity.
 */
interface ICenterLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    isBaselineAlign: boolean;
    children?: React.ReactNode;
}

/**
 * Returns a customized styles object using makeStyles.
 *
 */
const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    container: {
        minWidth: 1,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flex: 1,
    },
    content: {
        overflow: 'hidden',
        flex: 1,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});

/**
 * Component for centering its children with specified layout and alignment.
 *
 * @template Data - The data type for any additional props.
 *
 * @param props - The component props.
 * @param props.children - The children to be centered.
 * @param props.className - The class name for the component.
 * @param props.style - The inline styles for the component.
 * @param [props.innerPadding='0px'] - The padding applied to the inner content of the component.
 * @param [props.columns] - The number of columns for the layout.
 * @param [props.phoneColumns] - The number of columns for phone layout.
 * @param [props.tabletColumns] - The number of columns for tablet layout.
 * @param [props.desktopColumns] - The number of columns for desktop layout.
 * @param [props.columnsOverride] - Overrides the default number of columns.
 * @param [props.isBaselineAlign] - Specifies whether the children should be aligned based on the baseline.
 * @param [props.sx] - Additional styles for the component using sx prop from @mui/system.
 * @param [props.fieldRightMargin='0'] - The margin applied to the right of each field within the component.
 * @param [props.fieldBottomMargin='0'] - The margin applied to the bottom of each field within the component.
 *
 * @returns - The centered content.
 */
export const CenterLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    innerPadding: padding = '0px',
    columns,
    phoneColumns,
    tabletColumns,
    desktopColumns,
    columnsOverride,
    isBaselineAlign,
    testId,
    sx,
    fieldRightMargin = '0',
    fieldBottomMargin = '0',
}: ICenterLayoutProps<Data> & ICenterLayoutPrivate<Data>) => {
    const { classes } = useStyles();

    const [groupRef, setGroupRef] = useState<HTMLDivElement>();
    const [marginRight, setMarginRight] = useState(0);

    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, []);

    useEffect(() => {

        const handler = () => {
            if (groupRef && isMounted.current) {
                const { width, left } = groupRef.getBoundingClientRect();
                let right = 0;
                groupRef.querySelectorAll(':scope > *').forEach((el) => right = Math.max(right, el.getBoundingClientRect().right));
                const marginRight = Math.min(right - left - width, 0);
                setMarginRight(marginRight);
            }
        };

        const handlerD = debounce(handler, CENTER_DEBOUNCE);

        const mObserver = new MutationObserver(handlerD);
        const rObserver = new ResizeObserver(handlerD);

        if (groupRef) {
            mObserver.observe(groupRef, {
                childList: true,
                subtree: true,
            });
            rObserver.observe(groupRef);
            window.addEventListener('resize', handlerD);
            handler();
        };

        return () => {
            handlerD.clear();
            mObserver.disconnect();
            groupRef && rObserver.unobserve(groupRef);
            window.removeEventListener('resize', handlerD);
            rObserver.disconnect();
        };
    }, [groupRef]);

    const handleGroupRef = (groupRef: HTMLDivElement) => setGroupRef(groupRef);

    return (
        <Group
            className={className}
            style={style}
            sx={sx}
            isItem={true}
            data-testid={testId}
            columns={columns}
            phoneColumns={phoneColumns}
            tabletColumns={tabletColumns}
            desktopColumns={desktopColumns}
            fieldRightMargin={fieldRightMargin}
            fieldBottomMargin={fieldBottomMargin}
        >
            <div ref={elementRef} className={classes.root}>
                <div className={classNames(classes.container)}>
                    <div className={classes.content} style={{ padding }}>
                        <div style={{ marginRight, width: marginRight ? size.width : "100%" }}>
                            <Group
                                columnsOverride={columnsOverride}
                                isBaselineAlign={isBaselineAlign}
                                ref={handleGroupRef}
                            >
                                {children}
                            </Group>
                        </div>
                    </div>
                </div>
            </div>
        </Group>
    );
};

CenterLayout.displayName = 'CenterLayout';

export default makeLayout(CenterLayout) as typeof CenterLayout;
