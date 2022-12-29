import * as React from 'react';

import Typography from "@mui/material/Typography";

interface ILogoProps {
    appName: string;
}

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
