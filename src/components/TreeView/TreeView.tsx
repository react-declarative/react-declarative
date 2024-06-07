import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { makeStyles } from "../../styles";

import MatTextField, { TextFieldProps } from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";

import randomString from "../../utils/randomString";
import classNames from "../../utils/classNames";
import debounce from "../../utils/hof/debounce";
import deepFlat from "./utils/deepFlat";

import useChangeSubject from "../../hooks/useChangeSubject";
import useReloadTrigger from "../../hooks/useReloadTrigger";
import useActualState from "../../hooks/useActualState";
import useChange from "../../hooks/useChange";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import INode from "./model/INode";

const MOUSE_OUT_DEBOUNCE = 45;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * Represents the properties for the ITreeView component.
 *
 * @typedef ITreeViewProps
 * @property [value] - The selected values in the tree view.
 * @property [readOnly=false] - Specifies whether the tree view is read-only or not.
 * @property [loading=false] - Specifies whether the tree view is in loading state or not.
 * @property items - The nodes to render in the tree view.
 * @property [onChange] - The function to be called when the value in the tree view changes. It accepts a single parameter which is the new selected value or null.
 * @property [TextFieldProps] - The additional properties for the TextField component.
 */
type ITreeViewProps = {
  value?: string[] | null;
  readOnly?: boolean;
  loading?: boolean;
  items: INode[];
  onChange?: (value: string[] | null) => void;
} & Omit<
  TextFieldProps,
  keyof {
    onChange: never;
  }
>;

/**
 * Function to create and return an object of CSS styles using the makeStyles hook from Material-UI.
 *
 * @function useStyles
 * @returns The object containing CSS styles.
 */
const useStyles = makeStyles()((theme) => ({
  ul: {
    listStyleType: "none",
    padding: 0,
    "& > *:not(:first-of-type)": {
      marginLeft: "32px",
    },
  },
  li: {
    paddingBottom: "6px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  listItem: {
    "&:hover": {
      background: "transparent !important",
    },
  },
  hidden: {
    display: "none",
  },
  icons: {
    fill: theme.palette.action.active,
  },
}));

/**
 * Represents a TreeView component.
 *
 * @param className - The class name of the component.
 * @param style - The style object of the component.
 * @param sx - The sx object of the component.
 * @param loading - Indicates whether the component is in a loading state.
 * @param items - The items to be displayed in the TreeView.
 * @param value - The selected values in the TreeView.
 * @param onChange - The function to be called when the value of the TreeView changes.
 * @param textFieldProps - Additional props to be passed to the underlying TextField component.
 */
export const TreeView = ({
  className,
  style,
  sx,
  disabled,
  loading,
  readOnly,
  items: upperItems = [],
  value: upperValue = [],
  onChange = () => undefined,
  ...textFieldProps
}: ITreeViewProps) => {
  const { classes } = useStyles();

  const upperChange = useRef(false);

  const [value$, setValue] = useActualState(upperValue || []);
  const [opened, setOpened] = useState(false);

  useChange(() => {
    upperChange.current = true;
    setValue(upperValue || []);
  }, [upperValue]);

  const { reloadTrigger, doReload } = useReloadTrigger();

  const changeSubject = useChangeSubject(value$.current);

  useChange(() => {
    if (upperChange.current) {
      upperChange.current = false;
      return;
    }
    if (value$.current.length) {
      onChange(value$.current);
      return;
    }
    onChange(null);
  }, [value$.current]);

  useEffect(() => {
    if (!opened) {
      return;
    }
    let unsubscribeRef = changeSubject.once(() => {
      const handler = debounce(({ clientX, clientY }: MouseEvent) => {
        const target = document.elementFromPoint(clientX, clientY);
        if (!target?.closest(".MuiAutocomplete-popper")) {
          setOpened(false);
          doReload();
        }
      }, MOUSE_OUT_DEBOUNCE);
      document.addEventListener("mousemove", handler);
      unsubscribeRef = () => {
        document.removeEventListener("mousemove", handler);
        handler.clear();
      };
    });
    return () => unsubscribeRef();
  }, [opened]);

  const { items, groupIdMap, groupValueMap } = useMemo(() => {
    let items = upperItems.map(({ label, value, child: upperChild = [] }) => {
      const groupId = randomString();
      const child = upperChild.map(({ label, value }) => ({
        label,
        value,
        groupId,
      }));
      return {
        label,
        value,
        groupId,
        child: child.length ? child : undefined,
      };
    });
    items = deepFlat(items);
    const groupIdMap = new Map<string, { label: string; child: string[] }>();
    const groupValueMap = new Map<string, { label: string; child: string[] }>();
    items.forEach((item) => {
      if (!item.child) {
        return;
      }
      const data = {
        label: item.label,
        child: item.child.map(({ value }) => value),
      };
      groupIdMap.set(item.groupId, data);
      groupValueMap.set(item.value, data);
    });
    return {
      items,
      groupIdMap,
      groupValueMap,
    };
  }, [upperItems]);

  /**
   * Toggles values in a set based on the current state.
   *
   * @param values - The values to be toggled.
   * @returns
   */
  const handleToggle = (...values: string[]) => {
    const prevValue = value$.current;
    const currentValue = new Set(prevValue);
    const deselect = values.some((value) => currentValue.has(value));
    values.forEach((value) => {
      if (deselect) {
        currentValue.delete(value);
      } else {
        currentValue.add(value);
      }
    });
    const value = [...currentValue];
    setValue(value);
    onChange(value);
  };

  /**
   * Represents the autocomplete value based on filtered items.
   *
   * @type {Array}
   */
  const autocompleteValue = useMemo(() => {
    return items.filter((item) => value$.current.includes(item.value));
  }, [value$.current, items]);

  return (
    <Autocomplete
      key={reloadTrigger}
      loading={loading}
      className={className}
      style={style}
      sx={sx}
      options={items}
      value={autocompleteValue}
      open={opened}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      multiple
      disabled={disabled}
      readOnly={readOnly}
      disableCloseOnSelect
      groupBy={(option) => option.groupId}
      getOptionLabel={(option) => option.label || ""}
      renderInput={(params) => (
        <MatTextField
          {...params}
          {...textFieldProps}
          InputProps={{
            ...params.InputProps,
            ...textFieldProps.InputProps,
            readOnly,
          }}
        />
      )}
      renderGroup={(params) => {
        const group = groupIdMap.get(params.group);
        if (!group) {
          return <>{params.children}</>;
        }
        const checked = group.child.every((child) => value$.current.includes(child));
        const indeterminate = group.child.some((child) => value$.current.includes(child));
        return (
          <li key={params.key}>
            <ul className={classes.ul}>
              <ListItemButton
                key={-1}
                onClick={() => handleToggle(...group.child)}
                className={classes.li}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    disableRipple
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={checked}
                    indeterminate={indeterminate}
                  />
                </ListItemIcon>
                <ListItemText primary={group.label} />
                <ArrowDropDownIcon className={classes.icons} />
              </ListItemButton>
              {params.children}
            </ul>
          </li>
        );
      }}
      renderOption={(_, option: any, state) => (
        <ListItemButton
          key={option.value}
          className={classNames(classes.li, {
            [classes.hidden]: groupValueMap.has(option.value),
          })}
          onClick={() => handleToggle(option.value)}
          dense
        >
          <ListItemIcon>
            <Checkbox
              disableRipple
              icon={icon}
              checkedIcon={checkedIcon}
              checked={state.selected}
            />
          </ListItemIcon>
          <ListItemText primary={option["label"]} />
        </ListItemButton>
      )}
      renderTags={(value, getTagProps) => (
        <>
          {value.map((option, index) => (
            <Chip
              variant="outlined"
              {...getTagProps({ index })}
              label={option.label}
              onDelete={readOnly ? undefined : () => handleToggle(option.value)}
            />
          ))}
        </>
      )}
    />
  );
};

export default TreeView;
