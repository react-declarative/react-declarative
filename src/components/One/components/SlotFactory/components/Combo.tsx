import * as React from "react";
import { useMemo, useState, useRef, useEffect } from "react";

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

import { useOneState } from "../../../context/StateProvider";
import { useOneProps } from "../../../context/PropsProvider";
import { useOnePayload } from "../../../context/PayloadProvider";
import { useAsyncAction } from "../../../../../hooks/useAsyncAction";
import { useActualValue } from "../../../../../hooks/useActualValue";
import { useRenderWaiter } from "../../../../../hooks/useRenderWaiter";
import { useReloadTrigger } from "../../../../../hooks/useReloadTrigger";
import { useSubject } from "../../../../../hooks/useSubject";

import RadioIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { IComboSlot } from "../../../slots/ComboSlot";

const icon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedIcon = <RadioIcon fontSize="small" />;

const EMPTY_ARRAY = [] as any;
const MOUSE_OUT_DEBOUNCE = 45;

const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join("-");

interface IState {
  options: string[];
  labels: Record<string, string>;
}

export const Combo = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  virtualListBox,
  watchItemList,
  labelShrink,
  noDeselect,
  freeSolo,
  title = "",
  dirty,
  invalid,
  incorrect,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {
  const { object } = useOneState();
  const payload = useOnePayload();

  const { reloadTrigger, doReload } = useReloadTrigger();

  const [state, setState] = useState<IState>(() => ({
    options: [],
    labels: {},
  }));

  const [opened, setOpened] = useState(false);

  const initComplete = useRef(false);

  const waitForRender = useRenderWaiter([state], 10);

  const labels$ = useActualValue(state.labels);

  const value = useMemo(() => {
    if (Array.isArray(upperValue)) {
      const [first] = upperValue;
      return first;
    }
    return upperValue;
  }, [upperValue]);

  const { fallback } = useOneProps();

  const { loading, execute } = useAsyncAction(
    async (object) => {
      const labels: Record<string, string> = {};
      itemList = itemList || [];
      const options: string[] = [
        ...new Set(
          Object.values(
            typeof itemList === "function"
              ? await Promise.resolve(itemList(object, payload))
              : itemList
          )
        ),
      ];
      await Promise.all(
        options.map(
          async (item) =>
            (labels[item] = await Promise.resolve(tr(item, object, payload)))
        )
      );

      if (freeSolo && value) {
        !options.includes(value) && options.push(value);
      }

      setState({ labels, options });
      initComplete.current = true;
      await waitForRender();
    },
    {
      fallback,
    }
  );

  const valueHash = getArrayHash(value);
  const prevObject = useRef<any>(null);
  const initial = useRef(true);

  useEffect(() => {
    if (!initial.current) {
      if (prevObject.current === object) {
        return;
      }
      if (!watchItemList) {
        return;
      }
    }
    prevObject.current = object;
    initial.current = false;
    execute(object);
  }, [valueHash, disabled, dirty, invalid, incorrect, object, readonly]);

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
        {freeSolo ? option : labels[option] || `${option} (unknown)`}
      </li>
    );
  };

  const getOptionLabel = (v: string) => {
    const { current: labels } = labels$;
    if (freeSolo) {
      return v;
    }
    return labels[v] || `${v} (unknown)`;
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
    onChange(value || null);
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
        options={EMPTY_ARRAY}
        onChange={() => null}
        freeSolo={freeSolo}
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
      loading={loading}
      value={value || null}
      onChange={({}, v) => handleChange(v)}
      getOptionLabel={getOptionLabel}
      freeSolo={freeSolo}
      options={state.options}
      disabled={disabled}
      readOnly={readonly}
      ListboxComponent={virtualListBox ? VirtualListBox : undefined}
      renderInput={createRenderInput(false, readonly)}
      renderOption={renderOption}
    />
  );
};

export default Combo;
