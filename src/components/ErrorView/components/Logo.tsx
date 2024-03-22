import * as React from 'react';

import Typography from "@mui/material/Typography";

/**
 * Interface representing the props for a Logo component.
 */
interface ILogoProps {
    appName: string;
}

/**
 * Represents the logo component.
 *
 * @param props - The properties to configure the logo.
 * @param props.appName - The name of the application to display in the logo.
 *
 * @returns - The logo component.
 */
export const Logo = ({
    appName,
}: ILogoProps) => (
    <Typography
        variant="h2"
        color="primary"
        width="100%"
        textAlign="center"
        fontWeight="bold"
        sx={{
            textStroke: '2px #fff',
            'WebkitTextStroke': '2px #fff',
        }}
    >
        {appName}
    </Typography>
);

export default Logo;
