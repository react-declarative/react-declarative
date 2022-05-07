import * as React from 'react';

import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

import { makeStyles } from '../../../../../../../../styles';

import CommonCellSlot, { ICommonCellSlot } from '../../../../../../slots/CommonCellSlot';

import ColumnType from '../../../../../../../../model/ColumnType';

import classNames from '../../../../../../../../utils/classNames';

interface IMobileCommonCellProps extends ICommonCellSlot {
    colSpan: number;
    withLabel: boolean;
    disableGutters: boolean;
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
        paddingBottom: '0 !important',
    },
    noGutters: {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
    },
    container: {
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    content: {
        position: 'relative',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        flex: 1,
    },
    shrinkWidth: {
        width: 48,
        maxWidth: 48,
    },
    componentHeight: {
        minHeight: 70,
    },
});

export const MobileCommonCell = ({
    colSpan,
    withLabel,
    disableGutters,
    ...props
}: IMobileCommonCellProps) => {

    const classes = useStyles();

    const { column } = props;

    return (
        <TableCell
            className={classNames(classes.root, {
                [classes.noGutters]: disableGutters,
                [classes.shrinkWidth]: column.type === ColumnType.Action,
            })}
            colSpan={colSpan}
        >
            <Box className={classes.container}>
                {withLabel && (
                    <Typography variant="body1">
                        {column.headerName}
                    </Typography>
                )}
                <Box className={classNames(classes.content, {
                    [classes.componentHeight]: column.type === ColumnType.Component,
                })}>
                    <CommonCellSlot
                        {...props}
                    />
                </Box>
            </Box>
        </TableCell>
    );
};

export default MobileCommonCell;
