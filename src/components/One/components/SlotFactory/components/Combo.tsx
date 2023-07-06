import * as React from 'react';
import { useMemo, useState, useRef } from 'react';

import Async from '../../../../Async';

import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";

import randomString from '../../../../../utils/randomString';
import arrays from '../../../../../utils/arrays';

import { useOneState } from '../../../context/StateProvider';
import { useOneProps } from '../../../context/PropsProvider';
import { useOnePayload } from '../../../context/PayloadProvider';

import { IComboSlot } from '../../../slots/ComboSlot';

const EMPTY_ARRAY = [] as any;

const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join('-');

export const Combo = ({
  value,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  keepSync,
  title = "",
  dirty,
  invalid,
  tr = (s) => s.toString(),
  shouldUpdateItemList: shouldUpdate = () => false,
  onChange,
}: IComboSlot) => {

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

  const createGetOptionLabel = (labels: Record<string, any>) => (v: string) => labels[v] || `${v} (unknown)`;

  const Loader = () => (
    <Autocomplete
      disabled
      loading
      value={null}
      options={EMPTY_ARRAY}
      onChange={() => null}
      getOptionLabel={createGetOptionLabel({})}
      renderInput={createRenderInput(true, true)}
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
      if (!readonly) {
        !keepSync && setUnfocused(true);
        !keepSync && onChange(value);
      }
    };

    const handleChange = (value: any) => {
      setValue(value);
      if (keepSync) {
        onChange(value)
      }
    };

    return (
      <Autocomplete
        value={value || null}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={({ }, v) => handleChange(v)}
        getOptionLabel={createGetOptionLabel(labels)}
        options={options}
        disabled={disabled}
        readOnly={readonly || unfocused}
        renderInput={createRenderInput(false, readonly || unfocused)}
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
