import * as React from 'react';

import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

import { makeStyles } from '../../../../../../../../styles';

import CommonCellSlot, { ICommonCellSlot } from '../../../../../../slots/CommonCellSlot';

import ColumnType from '../../../../../../../../model/ColumnType';

import fieldToHeader from '../../../../../../helpers/fieldToHeader';

import classNames from '../../../../../../../../utils/classNames';
import * as typo from '../../../../../../../../utils/typo';

interface IMobileCommonCellProps extends ICommonCellSlot {
    colSpan: number;
    withLabel: boolean;
    disableGutters: boolean;
}

const COMPONENT_MIN_HEIGHT = 70;

const useStyles = makeStyles()({
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
});

export const MobileCommonCell = ({
    colSpan,
    withLabel,
    disableGutters,
    ...props
}: IMobileCommonCellProps) => {

    const { classes } = useStyles();

    const { column } = props;

    const { minHeight: minHeightCol } = column;
    const minHeight = minHeightCol || (column.type === ColumnType.Component ? COMPONENT_MIN_HEIGHT : undefined);

    const { headerName = fieldToHeader(column.field || '') || 'Unknown' } = column;

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
                    <Typography variant="body1" fontWeight="bold">
                        {`${typo.bullet} ${headerName}`}
                    </Typography>
                )}
                <Box 
                    className={classes.content}
                    style={{
                        minHeight,
                    }}
                >
                    <CommonCellSlot
                        {...props}
                    />
                </Box>
            </Box>
        </TableCell>
    );
};

export default MobileCommonCell;
