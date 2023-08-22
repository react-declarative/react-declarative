import * as React from 'react';
import { useMemo, useState, useRef } from 'react';

import Async from '../../../../Async';
import VirtualListBox from '../../common/VirtualListBox';

import { AutocompleteRenderInputParams, AutocompleteRenderOptionState } from "@mui/material/Autocomplete";

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";
import Radio from '@mui/material/Radio';

import compareArray from '../../../../../utils/compareArray';
import randomString from '../../../../../utils/randomString';
import arrays from '../../../../../utils/arrays';

import { useOneState } from '../../../context/StateProvider';
import { useOneProps } from '../../../context/PropsProvider';
import { useOnePayload } from '../../../context/PayloadProvider';

import RadioIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { IComboSlot } from '../../../slots/ComboSlot';

const icon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedIcon = <RadioIcon fontSize="small" />;

const EMPTY_ARRAY = [] as any;

const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join('-');

export const Combo = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  virtualListBox,
  keepSync,
  freeSolo,
  title = "",
  dirty,
  invalid,
  tr = (s) => s.toString(),
  shouldUpdateItemList: shouldUpdate = () => false,
  onChange,
}: IComboSlot) => {

  const value = useMemo(() => {
    if (Array.isArray(upperValue)) {
      const [first] = upperValue;
      return first;
    }
    return upperValue;
  }, [upperValue]);

  const { object: upperObject } = useOneState();
  const payload = useOnePayload();

  const { fallback = (e: Error) => {
    throw e;
  } } = useOneProps();

  const initialObject = useRef(upperObject);
  const prevObject = useRef<any>(null);

  const object = useMemo(() => {
    if (!shouldUpdate(prevObject.current, upperObject, payload)) {
      return prevObject.current || initialObject.current;
    } else {
      prevObject.current = upperObject;
      return prevObject.current;
    }
  }, [upperObject]);

  const valueHash = getArrayHash(value);

  const reloadCondition = useMemo(() => randomString(), [
    valueHash,
    disabled,
    dirty,
    invalid,
    object,
    readonly,
  ]);

  const createRenderInput = (loading: boolean, readonly: boolean) => (params: AutocompleteRenderInputParams) => (
    <MatTextField
      {...params}
      variant={outlined ? "outlined" : "standard"}
      label={title}
      placeholder={placeholder}
      helperText={(dirty && invalid) || description}
      error={dirty && invalid !== null}
      InputProps={{
        ...params.InputProps,
        readOnly: readonly,
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );

  const createRenderOption = (labels: Record<string, any>) => (props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState) => (
    <li {...props}>
        <Radio
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={state.selected}
        />
        {freeSolo ? option : (labels[option] || `${option} (unknown)`)}
    </li>
  );

  const createGetOptionLabel = (labels: Record<string, any>) => (v: string) => {
    if (freeSolo) {
      return v;
    }
    return labels[v] || `${v} (unknown)`;
  };

  const Loader = () => (
    <Autocomplete
      disableCloseOnSelect
      disabled
      loading
      value={null}
      options={EMPTY_ARRAY}
      onChange={() => null}
      freeSolo={freeSolo}
      ListboxComponent={virtualListBox ? VirtualListBox : undefined}
      getOptionLabel={createGetOptionLabel({})}
      renderInput={createRenderInput(true, true)}
      renderOption={createRenderOption({})}
    />
  );

  const Content = ({
    labels,
    options,
    data
  }: {
    labels: Record<string, any>;
    options: any[];
    data: any;
  }) => {
    const [unfocused, setUnfocused] = useState(keepSync ? false : true);
    const [value, setValue] = useState(data);

    const handleFocus = () => {
      if (!readonly) {
        setUnfocused(false);
      }
    };

    const handleBlur = () => {
      if (!readonly && !keepSync ) {
        setUnfocused(true);
        if (!compareArray(data, value)) {
          onChange(value);
        }
      }
    };

    const handleChange = (value: any) => {
      setValue(value);
      if (keepSync) {
        onChange(value);
      }
    };

    return (
      <Autocomplete
        disableCloseOnSelect
        value={value || null}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={({ }, v) => handleChange(v)}
        getOptionLabel={createGetOptionLabel(labels)}
        ListboxComponent={virtualListBox ? VirtualListBox : undefined}
        freeSolo={freeSolo}
        options={options}
        disabled={disabled}
        readOnly={readonly || unfocused}
        renderInput={createRenderInput(false, readonly || unfocused)}
        renderOption={createRenderOption(labels)}
      />
    );
  };

  return (
    <Async Loader={Loader} payload={reloadCondition} fallback={fallback}>
      {async () => {

        const labels: Record<string, string> = {};
        itemList = arrays(itemList) || [];
        const options = Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object, payload)) : itemList);
        await Promise.all(options.map(async (item) => labels[item] = await Promise.resolve(tr(item, object, payload))));

        if (freeSolo && value) {
          !options.includes(value) && options.push(value);
        }

        return (
          <Content
            options={options}
            labels={labels}
            data={value}
          />
        );
      }}
    </Async>
  );

};

export default Combo;
