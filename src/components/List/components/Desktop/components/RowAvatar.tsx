import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import IListProps from '../../../../../model/IListProps';

import MatAvatar from '@material-ui/core/Avatar';

interface IRowAvatarProps {
    rows: any[];
    rowId: string;
    rowAvatar: IListProps<any>['rowAvatar'];
}

const useStyles = makeStyles({
    avatar: {
        borderRadius: 3,
        height: 24,
        width: 24,
    },
});

const RowAvatar = ({
    rowAvatar,
    rowId,
    rows,
}: IRowAvatarProps) => {
    const classes = useStyles();

    const getRow = (id: string) => rows.find((row) => row.id === id);

    const getRowAvatar = (id: string) => {
        const row = getRow(id);
        if (row && rowAvatar) {
            return typeof rowAvatar === 'function'
                ? rowAvatar(row)
                : {
                    src: rowAvatar.src ? row[rowAvatar.src] : '',
                    alt: rowAvatar.alt ? row[rowAvatar.alt] : '',
                };
        } else {
            return {
                src: '',
                alt: '',
            };
        }
    };

    const avatar = getRowAvatar(rowId);

    return (
        <MatAvatar
            className={classes.avatar}
            {...avatar}
        />
    );
};

export default RowAvatar;
