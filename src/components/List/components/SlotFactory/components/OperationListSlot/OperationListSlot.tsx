import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../../../../../styles';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import FadeView from '../../../../../FadeView';
import Async from '../../../../../Async';

import useActualCallback from '../../../../../../hooks/useActualCallback';

import useCachedRows from '../../../../hooks/useCachedRows';
import usePayload from '../../../../hooks/usePayload';
import useReload from '../../../../hooks/useReload';
import useProps from '../../../../hooks/useProps';

import { IOperationListSlot } from '../../../../slots/OperationListSlot';

import classNames from '../../../../../../utils/classNames';

const LOAD_SOURCE = 'list-operations';
const LABEL_SHRINK = 500;

const useStyles = makeStyles()({
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

export const OperationListSlot = ({
    className,
    style,
    operations,
    width,
}: IOperationListSlot) => {

    const { classes } = useStyles();
    const theme = useTheme();

    const payload = usePayload();

    const {
        onOperation = () => null,
        fallback,
        onLoadStart,
        onLoadEnd,
        loading,
        withAllListOperations,
    } = useProps();

    const reload = useReload();

    const [isAll, setIsAll] = useState(false);

    const { selectedRows } = useCachedRows();

    const conditionPayload = isAll ? 'all' : selectedRows;

    const handleOperation = useActualCallback(onOperation);

    const createHandleOperationClick = (action: string) => () => {
        handleOperation(action, selectedRows, isAll, reload);
    };

    const AllCheckbox = (
        <Checkbox
            disabled={loading}
            value={isAll}
            onChange={() => setIsAll(!isAll)}
        />
    );

    const fadeColor = theme.palette.background.default;

    const nothingFound = !selectedRows.length && !isAll;

    const Loader = () => (
        <>
            {operations.map(({ label, icon: Icon }, idx) => (
                <Button
                    disabled
                    key={idx}
                    size="small"
                    variant="contained"
                    startIcon={Icon && <Icon />}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                            <Box display="flex" alignItems="center">
                                <CircularProgress
                                    size="16px"
                                    color="inherit"
                                />
                            </Box>
                        <Box>
                            {label}
                        </Box>
                    </Stack>
                </Button>
            ))}
        </>
    );

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    const Operation = ({
        available,
        onClick,
        label,
        icon: Icon,
    }: {
        available: boolean;
        onClick: () => void;
        label: string;
        icon?: React.ComponentType<any>;
    }) => {
        const { loading } = useProps();
        return (
            <Button
                disabled={loading || !available}
                size="small"
                variant="contained"
                onClick={onClick}
                startIcon={Icon && <Icon />}
            >
                {label}
            </Button>
        );
    };

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
        >
            <FadeView className={classes.container} color={fadeColor}>
                <Box className={classes.content}>
                    <Async 
                        payload={conditionPayload}
                        deps={[payload]}
                        Loader={Loader}
                        fallback={fallback}
                        onLoadStart={handleLoadStart}
                        onLoadEnd={handleLoadEnd}
                        throwError
                    >
                        {async () => {
                            return await Promise.all(operations.map(async ({
                                action,
                                label,
                                icon,
                                isAvailable = true,
                            }, idx) => {
                                const handleAvailable = () => typeof isAvailable === 'function'
                                    ? isAvailable(selectedRows, isAll, payload)
                                    : isAvailable;
                                const available = nothingFound ? false : await handleAvailable();
                                return (
                                    <Operation
                                        key={idx}
                                        available={available}
                                        label={label}
                                        icon={icon}
                                        onClick={createHandleOperationClick(action)}
                                    />
                                );
                            }));
                        }}
                    </Async>
                </Box>
            </FadeView>
            {withAllListOperations && (
                <Box className={classes.label}>
                    {width < LABEL_SHRINK ? (
                        AllCheckbox
                    ) : (
                        <FormControlLabel
                            disabled={loading}
                            control={AllCheckbox}
                            label="All items"
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default OperationListSlot;
