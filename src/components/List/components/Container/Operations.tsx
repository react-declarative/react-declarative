import * as React from 'react';
import { useState } from 'react';

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
import useReload from '../../hooks/useReload';
import useProps from '../../hooks/useProps';

import classNames from '../../../../utils/classNames';

const LOAD_SOURCE = 'list-operations';

interface IOperationsProps {
    className?: string;
    style?: React.CSSProperties;
    operations: IListOperation[];
    width: number;
}

const LABEL_SHRINK = 500;

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
    width,
}: IOperationsProps) => {

    const classes = useStyles();
    const theme = useTheme<Theme>();

    const { selection } = useSelection();

    const {
        onOperation,
        fallback,
        rows,
        onLoadStart,
        onLoadEnd,
    } = useProps();

    const reload = useReload();

    const [isAll, setIsAll] = useState(false);

    const selectedRows = rows.filter(({ id }) => selection.has(id));

    const conditionPayload = isAll ? 'all' : selection;

    const createHandleOperation = (action: string) => () => {
        onOperation && onOperation(action, selectedRows, isAll, reload);
    };

    const AllCheckbox = (
        <Checkbox
            value={isAll}
            onChange={() => setIsAll(!isAll)}
        />
    );

    const fadeColor = theme.palette.background.default;

    const nothingFound = !selection.size && !isAll;

    const Loader = () => (
        <>
            {operations.map(({ label }, idx) => (
                <Button
                    disabled
                    key={idx}
                    size="small"
                    variant="contained"
                >
                    {label}
                </Button>
            ))}
        </>
    );

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
        >
            <FadeView className={classes.container} color={fadeColor} payload={conditionPayload}>
                <Box className={classes.content}>
                    <Async 
                        payload={conditionPayload}
                        Loader={Loader}
                        fallback={fallback}
                        onLoadStart={handleLoadStart}
                        onLoadEnd={handleLoadEnd}
                    >
                        {async () => {
                            return await Promise.all(operations.map(async ({
                                action,
                                label,
                                isAvailable = true,
                            }, idx) => {
                                const handleAvailable = () => typeof isAvailable === 'function'
                                    ? isAvailable(selectedRows, isAll)
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
                {width < LABEL_SHRINK ? (
                    AllCheckbox
                ) : (
                    <FormControlLabel
                        control={AllCheckbox}
                        label="Apply for everyone"
                    />
                )}
            </Box>
        </Box>
    );
};

export default Operations;
