import * as React from 'react';

import { makeStyles } from '../../styles';

import Stack, { StackProps } from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import classNames from '../../utils/classNames';

interface IAlert {
    color: 'success' | 'info' | 'warning' | 'error';
    content: string;
}

interface IAlertViewProps extends StackProps {
    items?: IAlert[];
    variant?: 'standard' | 'filled' | 'outlined';
}

const useStyles = makeStyles()({
    hidden: {
        display: 'none',
    }
});

export const AlertView = ({
    className,
    items = [],
    variant = "outlined",
    ...otherProps
}: IAlertViewProps) => {
    const { classes } = useStyles();
    return (
        <Stack
            className={classNames(className, {
                [classes.hidden]: !items.length,
            })}
            direction='column'
            spacing={2}
            {...otherProps}
        >
            {items.map((item, idx) => (
                <Alert key={idx} variant="outlined" severity={item.color}>
                    {item.content}
                </Alert>
            ))}
        </Stack>
    );
};

export default AlertView;
