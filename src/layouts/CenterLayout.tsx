import * as React from 'react';

import { makeStyles } from '@material-ui/core';

import classNames from '../utils/classNames';

import IField from '../model/IField';
import IEntity from '../model/IEntity';
import IAnything from '../model/IAnything';
import { PickProp } from '../model/IManaged';

export interface ICenterLayoutProps<Data = IAnything> {
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
}

interface ICenterLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
        overflowY: 'auto',
        width: '100%',
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});

export const CenterLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
}: ICenterLayoutProps<Data> & ICenterLayoutPrivate<Data>) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.root, className)} style={style}>
            <div className={classes.container}>
                {children}
            </div>
        </div>
    );    
};

CenterLayout.displayName = 'CenterLayout';

export default CenterLayout;
