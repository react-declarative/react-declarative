import React from "react";
import { SxProps, Typography, alpha } from "@mui/material";

import { makeStyles } from '../../../styles';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';

import SelectionMode from "../../../model/SelectionMode";
import IAnything from "../../../model/IAnything";

import useSelection from "../hooks/useSelection";

import classNames from "../../../utils/classNames";

interface ITileContainerProps<Data extends IAnything = IAnything> {
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    selectionMode?: SelectionMode;
    withHeader?: boolean;
    headerLabel?: string;
    data: Data[];
    children: React.ReactNode;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
        '& > *': {
            flex: 1,
        },
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(1),
        alignItems: 'center',
        width: "100%",
        height: "35px",
        maxHeight: "35px",
        borderBottom: `1px solid ${alpha(
            theme.palette.getContrastText(theme.palette.background.default),
            0.23
        )}`,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    headerLabel: {
        opacity: 0.65,
    },
}));

export const TileContainer = ({
    className,
    style,
    sx,
    selectionMode = SelectionMode.None,
    headerLabel = "List",
    data,
    withHeader = false,
    children,
}: ITileContainerProps) => {
    const { classes } = useStyles();

    const { selection, setSelection } = useSelection();

    const renderCheckbox = () => {
    
        const handleCheckboxClick = () => {
          if (selectionMode === SelectionMode.None) {
            return;
          }
          if (selectionMode === SelectionMode.Single) {
            setSelection(new Set());
            return;
          }
          if (selection.size) {
            setSelection(new Set());
            return;
          }
          data.forEach(({ id }) => selection.add(id));
          setSelection(selection);
        };
    
        if (selectionMode === SelectionMode.Single) {
          return (
            <Radio
              onClick={handleCheckboxClick}
              color="primary"
            />
          );
        } else if (selectionMode === SelectionMode.Multiple) {
          return (
            <Checkbox
              checked={!!selection.size}
              onClick={handleCheckboxClick}
              color="primary"
            />
          );
        } else if (selectionMode === SelectionMode.None) {
          return (
            <Checkbox
              color="primary"
              onClick={handleCheckboxClick}
              disabled
            />
          );
        } else {
          return null;
        }
      };

    const renderHeader = () => {
        if (!withHeader) {
            return null;
        }
        return (
            <div className={classes.header}>
                {renderCheckbox()}
                {!!headerLabel && (
                    <Typography variant="body1" className={classes.headerLabel}>
                        {headerLabel}
                    </Typography>
                )}
            </div>
        );
    };

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
        >
            <div className={classes.container}>
                {renderHeader()}
                {children}
            </div>
        </Box>
    );
};

export default TileContainer;
