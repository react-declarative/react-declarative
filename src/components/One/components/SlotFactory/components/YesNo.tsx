import * as React from "react";
import { useMemo, useState, useEffect, useRef } from "react";

import VirtualListBox from "../../common/VirtualListBox";

import {
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
} from "@mui/material/Autocomplete";

import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";

import debounce from "../../../../../utils/hof/debounce";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneProps } from "../../../context/PropsProvider";
import { useOneState } from "../../../context/StateProvider";

import { useReloadTrigger } from "../../../../../hooks/useReloadTrigger";
import { useAsyncAction } from "../../../../../hooks/useAsyncAction";
import { useActualValue } from "../../../../../hooks/useActualValue";
import { useSubject } from "../../../../../hooks/useSubject";

import RadioIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { IYesNoSlot } from "../../../slots/YesNoSlot";

const icon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedIcon = <RadioIcon fontSize="small" />;

const MOUSE_OUT_DEBOUNCE = 45;

const OPTIONS = [
  "Yes",
  "No",
];

/**
 * Represents a YesNoField component.
 * @typedef  YesNoField
 * @property value - The value of the YesNoField.
 * @property disabled - Indicates whether the YesNoField is disabled.
 * @property readonly - Indicates whether the YesNoField is readonly.
 * @property description - The description of the YesNoField.
 * @property placeholder - The placeholder text of the YesNoField.
 * @property outlined - Indicates whether the YesNoField is outlined.
 * @property virtualListBox - Indicates whether to use the virtual list box for the YesNoField.
 * @property labelShrink - Indicates whether the label should shrink for the YesNoField.
 * @property noDeselect - Indicates whether deselection is allowed for the YesNoField.
 * @property title - The title of the YesNoField.
 * @property tr - The translation function for the YesNoField.
 * @property dirty - Indicates whether the YesNoField is dirty.
 * @property invalid - Indicates whether the YesNoField is invalid.
 * @property incorrect - Indicates whether the YesNoField is incorrect.
 * @property onChange - The change event handler for the YesNoField.
 */
export const YesNoField = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
  virtualListBox,
  labelShrink,
  noDeselect,
  title = "",
  tr = (v) => v,
  dirty,
  invalid,
  incorrect,
  onChange,
}: IYesNoSlot) => {
  const { reloadTrigger, doReload } = useReloadTrigger();

  const [labels, setLabels] = useState({});
  const [opened, setOpened] = useState(false);

  const initComplete = useRef(false);

  const labels$ = useActualValue(labels);

  const payload = useOnePayload();
  const { object } = useOneState();

  const value = useMemo(() => {
    if (upperValue === true) {
      return "Yes";
    }
    if (upperValue === false) {
      return "No";
    }
    return null;
  }, [upperValue]);

  const { fallback } = useOneProps();

  const { loading, execute } = useAsyncAction(
    async () => {
      const labels: Record<string, string> = {};
      await Promise.all(
        OPTIONS.map(
          async (item) =>
            (labels[item] = await Promise.resolve(tr(item, object, payload)))
        )
      );
      setLabels(labels);
      initComplete.current = true;
    },
    {
      fallback,
    }
  );

  useEffect(() => {
    execute();
  }, []);

  const getOptionLabel = (v: string) => {
    const { current: labels } = labels$;
    return labels[v] || v;
  };

  const createRenderInput =
    (loading: boolean, readonly: boolean) =>
    (params: AutocompleteRenderInputParams) =>
      (
        <MatTextField
          {...params}
          sx={{
            ...(!outlined && {
              position: "relative",
              mt: 1,
              "& .MuiFormHelperText-root": {
                position: "absolute",
                top: "100%",
              },
            }),
          }}
          variant={outlined ? "outlined" : "standard"}
          placeholder={loading ? undefined : placeholder}
          label={title}
          helperText={(dirty && (invalid || incorrect)) || description}
          error={dirty && (invalid !== null || incorrect !== null)}
          InputProps={{
            ...params.InputProps,
            readOnly: readonly,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            ...(labelShrink && { shrink: true }),
          }}
        />
      );

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState
  ) => {
    const { current: labels } = labels$;
    return (
      <li {...props}>
        <Radio
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={state.selected}
        />
        {labels[option] || option}
      </li>
    );
  };

  const changeSubject = useSubject<void>();

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

  const handleChange = (value: any) => {
    onChange(value === "Yes" ? true : value === "No" ? false : null);
    changeSubject.next();
  };

  if (loading || !initComplete.current) {
    return (
      <Autocomplete
        disableCloseOnSelect
        disableClearable={noDeselect}
        disabled
        loading
        value={null}
        options={OPTIONS}
        onChange={() => null}
        ListboxComponent={virtualListBox ? VirtualListBox : undefined}
        getOptionLabel={getOptionLabel}
        renderInput={createRenderInput(true, true)}
        renderOption={renderOption}
      />
    );
  }

  return (
    <Autocomplete
      key={reloadTrigger}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      disableCloseOnSelect
      disableClearable={noDeselect}
      value={value || null}
      onChange={({}, v) => handleChange(v)}
      options={OPTIONS}
      disabled={disabled}
      readOnly={readonly}
      ListboxComponent={virtualListBox ? VirtualListBox : undefined}
      getOptionLabel={getOptionLabel}
      renderInput={createRenderInput(false, readonly)}
      renderOption={renderOption}
    />
  );
};

export default YesNoField;
