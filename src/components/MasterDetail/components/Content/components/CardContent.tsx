import * as React from 'react';

import { makeStyles } from '../../../../../styles';
import { Paper, alpha } from '@mui/material';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import useMediaContext from '../../../../../hooks/useMediaContext';
import classNames from '../../../../../utils/classNames';

import MasterDetailMode from '../../../model/MasterDetailMode';

import IContentProps from "../IContentProps";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'grid',
    gridColumnGap: theme.spacing(1),
  },
  desktop: {
    gridTemplateColumns: 'auto 1fr',
  },
  mobile: {
    gridTemplateColumns: '1fr',
  },
  outline: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    border: `1px solid ${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23)}`,
    borderRadius: '4px',
  },
  sideMenu: {
    width: 256,
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'column',
    '& > *': {
      flex: 1,
    },
  },
  content: {
    position: 'relative',
    overflowY: 'auto',
  },
  listItem: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const CardContent = ({
  mode,
  items,
  children,
  onChange,
}: IContentProps) => {

  const { isMobile } = useMediaContext();

  const { classes } = useStyles();

  const renderList = () => (
    <List disablePadding dense>
      {items
        .filter(({ visible }) => !!visible)
        .map(({
          id,
          active,
          disabled,
          icon: Icon,
          label,
        }, idx) => (
          <ListItem disableGutters disablePadding dense key={`${id}-${idx}`} className={classes.listItem}>
            <ListItemButton
              disabled={disabled}
              selected={active}
              onClick={() => onChange(id)}
            >
              {!!Icon && (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              )}
              <ListItemText>{label}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  );

  const renderInner = () => {
    if (mode === MasterDetailMode.Paper) {
      return (
        <>
          <div className={classes.sideMenu}>
            <Paper>
              {renderList()}
            </Paper>
          </div>
          <div className={classes.content}>
            {children}
          </div>
        </>
      );
    }
    if (mode === MasterDetailMode.Outline) {
      return (
        <>
          <div className={classes.sideMenu}>
            <Box className={classes.outline}>
              {renderList()}
            </Box>
          </div>
          <div className={classes.content}>
            {children}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Box
      className={classNames(classes.root, {
        [classes.desktop]: !isMobile,
        [classes.mobile]: isMobile,
      })}
    >
      {renderInner()}
    </Box>
  );
};

export default CardContent;
