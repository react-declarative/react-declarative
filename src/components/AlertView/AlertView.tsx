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

/**
 * Represents an AlertView component that displays a stack of alerts.
 *
 * @param {Object} props - The properties used to configure the AlertView component.
 * @param {string} props.className - The CSS class name for the AlertView component.
 * @param {Array} props.items - An array of items to display as alerts.
 * @param {string} props.variant - The variant of the alerts. Default is "outlined".
 * @param {...*} props.otherProps - Additional props to be spread to the Stack component.
 * @returns {JSX.Element} - The rendered JSX element for the AlertView component.
 */
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
                <Alert key={idx} variant={variant} severity={item.color}>
                    {item.content}
                </Alert>
            ))}
        </Stack>
    );
};

export default AlertView;
