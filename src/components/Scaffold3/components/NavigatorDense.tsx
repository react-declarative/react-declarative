import * as React from "react";

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import { IScaffold3GroupInternal } from "../model/IScaffold3Group";

import OutlinedFlag from "@mui/icons-material/OutlinedFlag";

import { CLOSED_WIDTH } from "../config";

interface INavigatorDenseProps {
    options: IScaffold3GroupInternal[];
    onOptionClick?: (path: string, id: string) => void;
    onOptionGroupClick?: (path: string, id: string) => void;
}

export const NavigatorDense = ({
    options,
    onOptionClick = () => undefined,
    onOptionGroupClick = () => undefined,
}: INavigatorDenseProps) => {
    return (
        <Box
            sx={{
                position: 'relative',
                scrollbarWidth: 'none',
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
                        key={`${id}-${idx}`}
                        title={label}
                        PopperProps={{style:{zIndex:1000}}}
                        enterTouchDelay={0}
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
