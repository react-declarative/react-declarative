import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from "../../../../styles";
import { alpha } from '@mui/material/styles';

import classNames from '../../../../utils/classNames';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';

import { ISearchSlot } from '../../slots/SearchSlot';

import { IListAction } from '../../../../model/IListProps';

import ActionType from '../../../../model/ActionType';

import ActionAdd from "../../components/common/ListActionAdd";
import ActionFab from "../../components/common/ListActionFab";
import ActionMenu from "../../components/common/ListActionMenu";

import useProps from '../../hooks/useProps';
import usePayload from '../../hooks/usePayload';
import useCachedRows from '../../hooks/useCachedRows';

/**
 * Returns the styles for a component.
 *
 * @function
 * @returns The styles object.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05
    ),
  },
  container: {
    flex: 1,
    minHeight: 60,
    maxHeight: "50vh",
    overflow: "hidden",
    overflowY: "auto",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  disabled: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5,
  },
  labelContent: {
    display: 'flex',
    minHeight: '60px',
    '& > *:nth-of-type(1)': {
      flex: 1,
    },
    padding: theme.spacing(1),
  },
}));

/**
 * Represents a search input component with label, loading state, and search functionality.
 * @param props - The properties of the SearchSlot component.
 * @param props.className - The additional CSS class name for the root element of the component.
 * @param props.style - The inline CSS style object for the root element of the component.
 * @param props.label - The label text for the search input component.
 * @param props.loading - The loading state of the search input component.
 * @param props.search - The current search value of the search input component.
 * @param props.onSearchChange - The callback function triggered when the search value changes.
 * @returns - The rendered SearchSlot component.
 */
export const DenseSearchSlot = ({
  className,
  style,
  label,
  loading,
  search,
  height,
  width,
  onSearchChange = () => null,
}: ISearchSlot) => {

  const payload = usePayload();

  const { classes } = useStyles();

  const { selectedRows } = useCachedRows();

  const {
    actions = [],
  } = useProps();

  const createAction = ({
    type,
    options: upperOptions = [],
    isDisabled,
    isVisible,
    label,
    icon,
    action,
  }: IListAction) => {
    if (type === ActionType.Add) {
      return (
        <ActionAdd
          label={label}
          action={action}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      );
    } else if (type === ActionType.Fab) {
      return (
        <ActionFab
          label={label}
          action={action}
          icon={icon}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      );
    } else if (type === ActionType.Menu) {
      const options = upperOptions.map(
        ({ isDisabled = () => false, isVisible = () => true, ...other }) => ({
          ...other,
          isDisabled: () => isDisabled(selectedRows, payload),
          isVisible: () => isVisible(selectedRows, payload),
        }),
      );
      return <ActionMenu options={options} deps={[payload]} />;
    } else {
      throw new Error("List Actions unknown action type");
    }
  };

  /**
   * Executes the cleanup process for search functionality.
   *
   * @function handleSearchCleanup
   * @returns
   */
  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Box className={classes.labelContent}>
          <TextField
            label="Search"
            variant="standard"
            value={search}
            sx={{
              maxWidth: 'max(calc(50% - 75px), 256px)',
            }}
            onChange={({ target }) => onSearchChange(target.value)}
            onKeyDown={({ key, currentTarget }) => {
              if (key === 'Enter' || key === 'Escape') {
                currentTarget.blur();
              }
            }}
            className={classNames({
              [classes.disabled]: loading,
            })}
            InputProps={{
              readOnly: loading,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: !!search && (
                <InputAdornment sx={{ cursor: 'pointer', marginBottom: '15px' }} onClick={handleSearchCleanup} position="end">
                  <Close />
                </InputAdornment>
              ),
            }}
            placeholder={label}
            InputLabelProps={{
              shrink: true,
            }}
            focused
          />
        </Box>
      </div>
      <div className={classes.controls}>
        {actions.map((action, idx) => (
          <Fragment key={idx}>{createAction(action)}</Fragment>
        ))}
      </div>
    </div>
  );
};

export default DenseSearchSlot;
