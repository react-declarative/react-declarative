import * as React from 'react';
import { useMemo } from 'react';

import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

import { makeStyles } from '../../../../../../styles';

import CommonCellSlot, { ICommonCellSlot } from '../../../../slots/CommonCellSlot';

import ColumnType from '../../../../../../model/ColumnType';

import fieldToHeader from '../../../../helpers/fieldToHeader';

import classNames from '../../../../../../utils/classNames';
import * as typo from '../../../../../../utils/typo';

interface IMobileCommonCellProps extends ICommonCellSlot {
    className?: string;
    colSpan: number;
    withLabel: boolean;
    disableGutters: boolean;
}

const COMPONENT_MIN_HEIGHT = 70;
export const CONTENT_CELL = 'react_declarative_listMobileCell';

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
        fontWeight: 'bold',
        flex: 1,
    },
    shrinkWidth: {
        width: 48,
        maxWidth: 48,
    },
});

export const MobileCommonCell = ({
    className,
    colSpan,
    withLabel,
    fullWidth,
    disableGutters,
    ...props
}: IMobileCommonCellProps) => {

    const { classes } = useStyles();

    const { column } = props;

    const minHeight =  useMemo(() => {
        const { minHeight: minHeightCol } = column;
        return minHeightCol || (column.type === ColumnType.Component ? COMPONENT_MIN_HEIGHT : undefined)
    }, []);

    const maxWidth = useMemo(() => Math.max(fullWidth - 35, 0), [fullWidth]);

    const { headerName = fieldToHeader(column.field || '') || 'Unknown' } = column;

    return (
        <TableCell
            className={classNames(classes.root, className, {
                [classes.noGutters]: disableGutters,
                [classes.shrinkWidth]: column.type === ColumnType.Action,
            })}
            colSpan={colSpan}
        >
            <Box className={classes.container}>
                {withLabel && (
                    <Typography variant="body1">
                        {`${typo.bullet} ${headerName}`}
                    </Typography>
                )}
                <Box 
                    className={classNames(classes.content, CONTENT_CELL)}
                    style={{
                        minHeight,
                        maxWidth,
                    }}
                >
                    <CommonCellSlot
                        {...props}
                        fullWidth={fullWidth}
                    />
                </Box>
            </Box>
        </TableCell>
    );
};

export default MobileCommonCell;
