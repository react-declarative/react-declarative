import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { makeStyles } from '../../../../../styles';
import { Paper, alpha, useTheme } from '@mui/material';

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

import { MASTER_DETAIL_HEADER, MASTER_DETAIL_ROOT } from '../../../config';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'grid',
  },
  desktop: {
    gridTemplateColumns: '256px 1fr',
  },
  mobile: {
    gridTemplateColumns: '1fr',
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
  fixedPos: {
    position: 'fixed',
    width: 240,
  },
}));

/**
 * Component for rendering card content with side menu.
 *
 * @param CardContent - The props object for CardContent.
 * @param mode - The mode of the card content (MasterDetailMode.Paper or MasterDetailMode.Outline).
 * @param loading - Indicates if the content is in a loading state.
 * @param items - An array of items to display in the side menu.
 * @param children - The content to display in the card.
 * @param onChange - The function to call when an item in the side menu is clicked.
 * @param withMenuCollapse - Indicates if the side menu should collapse when there are no items.
 * @param withFixedPos - Indicates if the side menu should have a fixed position.
 * @param fixedPosHeaderAdjust - The adjustment value for the fixed position header.
 *
 * @returns - The rendered CardContent component.
 */
export const CardContent = ({
  mode,
  loading,
  items,
  children,
  onChange,
  withMenuCollapse,
  withFixedPos,
  fixedPosHeaderAdjust: headerAdjust,
}: IContentProps) => {
  const sideMenuRef = useRef<HTMLInputElement>(null);
  const [fixedPos, setFixedPos] = useState(false);
  const { isWide } = useMediaContext();

  const theme = useTheme();

  const { classes } = useStyles();

  useEffect(() => {
    const { current: sideMenu } = sideMenuRef;
    const container = sideMenu?.closest(`.${MASTER_DETAIL_ROOT}`);
    if (withFixedPos && sideMenu && container) {
      const handler = () => {
        let { top: initialTop } = container.getBoundingClientRect();
        const { scrollTop } = document.documentElement;
        initialTop += scrollTop;
        setFixedPos(scrollTop > initialTop);
      };
      handler();
      document.addEventListener('scroll', handler);
      return () => document.removeEventListener('scroll', handler);
    }
    return undefined;
  }, [sideMenuRef.current, isWide]);

  /**
   * Renders a list of items with corresponding icons, labels, and click handlers.
   *
   * @returns The rendered list component.
   */
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

  /**
   * Function that renders the inner content based on the value of the mode variable.
   *
   * @returns - The rendered inner content.
   */
  const renderInner = () => {
    if (mode === MasterDetailMode.Paper) {
      return (
        <>
          <Box
            className={classes.sideMenu}
            sx={{
              ...(isWide && !!items.length && {
                paddingRight: theme.spacing(2),
                paddingBottom: theme.spacing(2),
              }),
              ...(!isWide && {
                paddingBottom: theme.spacing(1),
              }),
            }}
          >
            {(!!items.length || !!loading || !withMenuCollapse) && (
              <Paper
                className={classNames(MASTER_DETAIL_HEADER, {
                  [classes.fixedPos]: fixedPos && isWide,
                })}
                sx={{
                  ...(fixedPos && isWide && {
                    top: headerAdjust,
                  }),
                }}
                ref={sideMenuRef}
              >
                {renderList()}
              </Paper>
            )}
          </Box>
          <div className={classes.content}>
            {children}
          </div>
        </>
      );
    }
    if (mode === MasterDetailMode.Outline) {
      return (
        <>
          <Box
            className={classes.sideMenu}
            sx={{
              ...(isWide && !!items.length && {
                paddingRight: theme.spacing(2),
                paddingBottom: theme.spacing(2),
              }),
              ...(!isWide && {
                paddingBottom: theme.spacing(1),
              }),
            }}
          >
            {(!!items.length || !!loading || !withMenuCollapse)  && (
              <Box
                className={classNames(MASTER_DETAIL_HEADER, classes.outline, {
                  [classes.fixedPos]: fixedPos && isWide,
                })}
                ref={sideMenuRef}
              >
                {renderList()}
              </Box>
            )}
          </Box>
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
