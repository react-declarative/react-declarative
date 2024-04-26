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

import useItemModal from "../../../../../hooks/useItemModal";
import useMediaContext from "../../../../../hooks/useMediaContext";

import { useOneState } from "../../../context/StateProvider";
import { useOneProps } from "../../../context/PropsProvider";
import { useOneMenu } from "../../../context/MenuProvider";
import { useOnePayload } from "../../../context/PayloadProvider";

import { useAsyncAction } from "../../../../../hooks/useAsyncAction";
import { useActualValue } from "../../../../../hooks/useActualValue";
import { useRenderWaiter } from "../../../../../hooks/useRenderWaiter";
import { useReloadTrigger } from "../../../../../hooks/useReloadTrigger";
import { useSubject } from "../../../../../hooks/useSubject";

import RadioIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { IComboSlot } from "../../../slots/ComboSlot";

import FieldType from "../../../../../model/FieldType";

const icon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedIcon = <RadioIcon fontSize="small" />;

const EMPTY_ARRAY = [] as any;
const MOUSE_OUT_DEBOUNCE = 45;

/**
 * Returns a hash string generated from the values in an array.
 *
 * @param value - The array object to generate the hash from.
 * @returns - The hash string generated from the array values.
 */
const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join("-");

/**
 * Represents the contract for the State class, which holds options and labels.
 *
 * @interface
 */
interface IState {
  options: string[];
  labels: Record<string, string>;
}

/**
 * Represents a Combo component.
 * @param value - The selected value(s) of the Combo.
 * @param disabled - Whether the Combo is disabled or not.
 * @param readonly - Whether the Combo is readonly or not.
 * @param description - The description of the Combo.
 * @param placeholder - The placeholder text of the Combo input.
 * @param outlined - Whether the Combo is outlined or not.
 * @param itemList - The list of items/options for the Combo.
 * @param virtualListBox - Whether to use a virtual list box for the Combo or not.
 * @param watchItemList - Whether to watch the itemList for changes or not.
 * @param labelShrink - Whether to shrink the label of the Combo or not.
 * @param noDeselect - Whether to allow deselecting an item or not.
 * @param freeSolo - Whether to allow free text input or not.
 * @param title - The title/label of the Combo.
 * @param dirty - Whether the Combo value is dirty/changed or not.
 * @param invalid - Whether the Combo value is invalid or not.
 * @param incorrect - Whether the Combo value is incorrect or not.
 * @param withContextMenu - Whether to show a context menu for the Combo or not.
 * @param tr - The translation function for the Combo.
 * @param onChange - The change event handler for the Combo.
 * @returns The Combo component.
 */
export const Combo = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
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
  withContextMenu,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {
  const { isMobile } = useMediaContext();
  const { object } = useOneState();
  const payload = useOnePayload();
  const { requestSubject } = useOneMenu();

  const { reloadTrigger, doReload } = useReloadTrigger();

  const [state, setState] = useState<IState>(() => ({
    options: [],
    labels: {},
  }));

  const [opened, setOpened] = useState(false);

  const initComplete = useRef(false);

  const waitForRender = useRenderWaiter([state], 10);

  const labels$ = useActualValue(state.labels);

  /**
   * Returns a memoized value based on the given `upperValue`.
   *
   * @param upperValue - The value to compute the memoized value from.
   * @returns - The computed memoized value.
   */
  const value = useMemo(() => {
    if (Array.isArray(upperValue)) {
      const [first] = upperValue;
      return first;
    }
    return upperValue;
  }, [upperValue]);

  const arrayValue = useMemo(() => {
    return value ? [value] : value;
  }, [value]);

  const pickModal = useItemModal({
    data: object,
    payload,
    itemList,
    keepRaw: false,
    onValueChange: onChange,
    placeholder,
    tip: undefined,
    title,
    tr,
    type: FieldType.Combo,
    value: arrayValue,
  });

  const { fallback } = useOneProps();

  /**
   * Loads the given variable from a source.
   */
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

  /**
   * Creates a render input function for an Autocomplete component.
   *
   * @param loading - Indicates if the Autocomplete is in a loading state.
   * @param readonly - Indicates if the Autocomplete is in a readonly state.
   * @returns A render input function for the Autocomplete component.
   * @param params - The Autocomplete render input parameters.
   * @returns The rendered input element.
   */
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

  /**
   * Renders an option for the Autocomplete component.
   *
   * @param props - The HTML attributes for the <li> element.
   * @param option - The option to render.
   * @param state - The state of the render option.
   * @returns - The rendered option.
   */
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

  /**
   * Retrieves the label for a given value.
   *
   * @param v - The value for which to retrieve the label.
   * @returns The label corresponding to the given value.
   */
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

  useEffect(() => withContextMenu && requestSubject.subscribe(() => {
    setOpened(false);
  }), []);

  /**
   * Handles the change of a value and triggers the corresponding
   * callback and event.
   *
   * @param value - The new value for the change event.
   * @returns
   */
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
      onOpen={() => {
        if (!isMobile) {
          setOpened(true);
          return;
        }
        pickModal();
      }}
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
