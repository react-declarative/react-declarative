import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { IWrappedLayout, PickProp } from '../../../model/IManaged';

import makeLayout from '../components/makeLayout/makeLayout';

/**
 * Represents the props for a stretch layout component.
 *
 * @template Data - The type of data being passed to the layout.
 * @template Payload - The type of payload being passed to the layout.
 */
export interface IStretchLayoutProps<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data> {
    innerPadding?: PickProp<IField<Data, Payload>, 'innerPadding'>;
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
}

/**
 * Represents a private interface for the StrechLayout component.
 *
 * @interface IStretchLayoutPrivate
 * @template Data - the type of the data.
 * @extends IEntity<Data>
 */
interface IStretchLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children?: React.ReactNode;
}

/**
 * Custom hook for applying styles to a component.
 * @returns The generated styles.
 */
const useStyles = makeStyles()({
    root: {
        position: 'relative',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
        '& > *': {
            flex: 1,
        },
    },
});

/**
 * A layout wrapper component that stretches its children horizontally and vertically.
 *
 * @template Data - The type of the data passed to the layout.
 *
 * @param props - The properties passed to the component.
 * @param props.children - The children components to be rendered inside the layout.
 * @param [props.className] - The additional CSS class name(s) to apply to the root element.
 * @param [props.style] - The inline styles to apply to the root element.
 * @param [props.innerPadding='0px'] - The padding to apply to the container element.
 *
 * @returns - The rendered StretchLayout component.
 */
export const StretchLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    testId,
    innerPadding: padding = '0px',
}: IStretchLayoutProps<Data> & IStretchLayoutPrivate<Data>) => {
    const { classes } = useStyles();
    return (
        <div className={classNames(classes.root, className)} data-testid={testId} style={style}>
            <div className={classes.container} style={{ padding }}>
                {children}
            </div>
        </div>
    );    
};

StretchLayout.displayName = 'StretchLayout';

export default makeLayout(StretchLayout) as typeof StretchLayout;
