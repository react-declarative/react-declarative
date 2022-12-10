import { Theme, useMediaQuery } from '@mui/material';

export const useMediaContext = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
    return {
        isMobile,
    };
};

export default useMediaContext;
