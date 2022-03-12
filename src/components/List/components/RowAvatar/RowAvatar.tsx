import * as React from 'react';

import { makeStyles } from '../../../../styles';

import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import MatAvatar from '@mui/material/Avatar';

import useRowAvatar from '../hooks/useRowAvatar';

interface IRowAvatarProps<RowData extends IRowData = IAnything> {
    row: RowData,
}

const useStyles = makeStyles({
    avatar: {
        border: '2.5px solid transparent',
        height: 24,
        width: 24,
    },
});

const RowAvatar = <RowData extends IRowData = IAnything>({
    row,
}: IRowAvatarProps<RowData>) => {

    const classes = useStyles();

    const avatar = useRowAvatar({ row });

    return avatar ? (
        <MatAvatar
            className={classes.avatar}
            {...avatar}
        />
    ) : null;
};

export default RowAvatar;
