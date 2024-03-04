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
import useChange from "../../hooks/useChange";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import INode from "./model/INode";

const MOUSE_OUT_DEBOUNCE = 45;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

export const TreeView = ({
  className,
  style,
  sx,
  loading,
  items: upperItems = [],
  value: upperValue = [],
  onChange = () => undefined,
  ...textFieldProps
}: ITreeViewProps) => {
  const { classes } = useStyles();

  const upperChange = useRef(false);

  const [value, setValue] = useState(upperValue || []);
  const [opened, setOpened] = useState(false);

  useChange(() => {
    upperChange.current = true;
    setValue(upperValue || []);
  }, [upperValue]);

  const { reloadTrigger, doReload } = useReloadTrigger();

  const changeSubject = useChangeSubject(value);

  useChange(() => {
    if (upperChange.current) {
      upperChange.current = false;
      return;
    }
    if (value.length) {
      onChange(value);
      return;
    }
    onChange(null);
  }, [value]);

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

  const handleToggle = (...values: string[]) =>
    setValue((prevValue) => {
      const currentValue = new Set(prevValue);
      const deselect = values.some((value) => currentValue.has(value));
      values.forEach((value) => {
        if (deselect) {
          currentValue.delete(value);
        } else {
          currentValue.add(value);
        }
      });
      return [...currentValue];
    });

  const autocompleteValue = useMemo(() => {
    return items.filter((item) => value.includes(item.value));
  }, [value, items]);

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
      disableCloseOnSelect
      onChange={(_, items) => {
        setValue(items.map(({ value }) => value));
      }}
      groupBy={(option) => option.groupId}
      getOptionLabel={(option) => option.label || ""}
      renderInput={(params) => <MatTextField {...params} {...textFieldProps} />}
      renderGroup={(params) => {
        const group = groupIdMap.get(params.group);
        if (!group) {
          return <>{params.children}</>;
        }
        const checked = group.child.every((child) => value.includes(child));
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
              onDelete={() => handleToggle(option.value)}
            />
          ))}
        </>
      )}
    />
  );
};

export default TreeView;
