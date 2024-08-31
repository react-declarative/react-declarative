import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { makeStyles } from '../../../styles';

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import useMediaContext from "../../../hooks/useMediaContext";

import debounce from "../../../utils/hof/debounce";

import { IScaffold3GroupInternal } from "../model/IScaffold3Group";

import OutlinedFlag from "@mui/icons-material/OutlinedFlag";

import { CLOSED_WIDTH } from "../config";

interface INavigatorDenseProps {
    swiping: boolean;
    options: IScaffold3GroupInternal[];
    onOptionClick?: (path: string, id: string) => void;
    onOptionGroupClick?: (path: string, id: string) => void;
}

const useStyles = makeStyles()({
    hidden: {
        visibility: 'hidden',
    },
});

export const NavigatorDense = ({
    swiping,
    options,
    onOptionClick = () => undefined,
    onOptionGroupClick = () => undefined,
}: INavigatorDenseProps) => {
    const { classes, cx } = useStyles();
    const [tooltip, setTooltip] = useState(false);
    const { isMobile } = useMediaContext();

    const handleClose = useMemo(() => debounce(() => {
        setTooltip(false);
    }, 500), []);

    const handleCancel = useCallback(() => {
        handleClose.clear();
    }, []);

    const handleOpen = useCallback(() => {
        handleClose.clear();
        setTooltip(true);
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                scrollbarWidth: 'none',
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                overflowX: 'hidden',
                overflowY: 'auto',
                maxWidth: CLOSED_WIDTH,
                minWidth: CLOSED_WIDTH,
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 2,
                    pt: 2
                }}
            >
                {options.flatMap(({ children }) => children).filter(({ visible }) => visible).map(({
                    icon: Icon = OutlinedFlag,
                    disabled,
                    id,
                    path,
                    label,
                    options,
                }, idx) => (
                    <Tooltip
                        arrow
                        open={tooltip}
                        hidden={swiping}
                        classes={{
                            tooltip: cx({
                                [classes.hidden]: swiping,
                            })
                        }}
                        onMouseMove={handleCancel}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        placement="right"
                        key={`${id}-${idx}`}
                        title={label || id}
                        PopperProps={{style:{zIndex:1000}}}
                        enterTouchDelay={isMobile ? 0 : undefined}
                    >
                        <Fab
                            disabled={disabled}
                            color="primary"
                            size="small"
                            onClick={() => {
                                if (options?.some(({ visible }) => visible)) {
                                    onOptionGroupClick(path, id);
                                    return;
                                }
                                onOptionClick(path, id);
                            }}
                        >
                            <Icon />
                        </Fab>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
};

export default NavigatorDense;
