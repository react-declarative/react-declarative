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

const useStyles = makeStyles()((theme, _, classes) => ({
  root: {
    display: 'grid',
  },
  desktop: {
    gridTemplateColumns: '256px 1fr',
    [`& .${classes["sideMenu"]}`]: {
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  mobile: {
    gridTemplateColumns: '1fr',
    [`& .${classes["sideMenu"]}`]: {
      paddingBottom: theme.spacing(1),
    },
  },
  outline: {
    border: `1px solid ${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23)}`,
    borderRadius: '4px',
  },
  sideMenu: {
    overflowY: 'auto',
    maxHeight: '80vh',
    overflowX: 'hidden',
    width: '100%',
    '& > * > *': {
      width: '100%',
    },
  },
  content: {
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  listItem: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const CardContent = ({
  mode,
  loading,
  items,
  children,
  onChange,
  withSideMenuCollapse,
}: IContentProps) => {

  const { isWide } = useMediaContext();

  const { classes } = useStyles();

  const renderList = () => (
    <List disablePadding dense>
      {items
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
            {(!!items.length || !!loading || !withSideMenuCollapse) && (
              <Paper>
                {renderList()}
              </Paper>
            )}
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
            {(!!items.length || !!loading || !withSideMenuCollapse)  && (
              <Box className={classes.outline}>
                {renderList()}
              </Box>
            )}
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
        [classes.desktop]: isWide && !!items.length,
        [classes.mobile]: !isWide,
      })}
    >
      {renderInner()}
    </Box>
  );
};

export default CardContent;
