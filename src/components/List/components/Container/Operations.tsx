import * as React from 'react';
import { useState, useMemo } from 'react';

import { makeStyles } from '../../../../styles';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import FadeView from '../../../FadeView';
import Async from '../../../Async';

import IListOperation from '../../../../model/IListOperation';

import useSelection from '../../hooks/useSelection';
import useProps from '../../hooks/useProps';

import classNames from '../../../../utils/classNames';
import randomString from '../../../../utils/randomString';

interface IOperationsProps {
    className?: string;
    style?: React.CSSProperties;
    operations: IListOperation[];
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        minHeight: 40,
        maxHeight: 40,
        marginTop: -15,
    },
    container: {
        flex: 1,
        marginRight: 15,
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        '& > *': {
            marginRight: '5px !important',
            whiteSpace: 'nowrap',
        },
    },
    label: {
        display: 'flex',
        whiteSpace: 'nowrap',
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
    },
});

export const Operations = ({
    className,
    style,
    operations,
}: IOperationsProps) => {

    const classes = useStyles();
    const theme = useTheme<Theme>();

    const { selection } = useSelection();

    const {
        onOperation,
    } = useProps();

    const rowIds = [...selection];

    const [isAll, setIsAll] = useState(false);

    const conditionPayload = useMemo(() => randomString(), [
        isAll,
        selection,
    ]);

    const createHandleOperation = (action: string) => () => {
        onOperation && onOperation(action, rowIds, isAll);
    };

    const allCheckbox = (
        <Checkbox
            value={isAll}
            onChange={() => setIsAll(!isAll)}
        />
    );

    const fadeColor = theme.palette.background.default;

    const nothingFound = !selection.size && !isAll;

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
        >
            <FadeView className={classes.container} color={fadeColor}>
                <Box className={classes.content}>
                    <Async payload={conditionPayload}>
                        {async () => {
                            return await Promise.all(operations.map(async ({
                                action,
                                label,
                                isAvailable = true,
                            }, idx) => {
                                const handleAvailable = () => typeof isAvailable === 'function'
                                    ? isAvailable(rowIds, isAll)
                                    : isAvailable;
                                const available = nothingFound ? false : await handleAvailable();
                                return (
                                    <Button
                                        disabled={!available}
                                        key={idx}
                                        size="small"
                                        variant="contained"
                                        onClick={createHandleOperation(action)}
                                    >
                                        {label}
                                    </Button>
                                );
                            }));
                        }}
                    </Async>
                </Box>
            </FadeView>
            <Box className={classes.label}>
                <FormControlLabel
                    control={allCheckbox}
                    label="Apply for everyone"
                />
            </Box>
        </Box>
    );
};

export default Operations;
