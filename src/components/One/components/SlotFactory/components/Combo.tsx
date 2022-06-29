import * as React from 'react';
import { useMemo, useState } from 'react';

import Async from '../../../../Async';

import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";

import arrays from '../../../../../utils/arrays';
import randomString from '../../../../../utils/randomString';

import { useOneState } from '../../../context/StateProvider';
import { useOneProps } from '../../../context/PropsProvider';

import { IComboSlot } from '../../../slots/ComboSlot';

const EMPTY_ARRAY = [] as any;

export const Combo = ({
  value,
  disabled,
  fieldReadonly,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  title = "",
  dirty,
  invalid,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {

  const { object } = useOneState();
  const { fallback } = useOneProps();

  const reloadCondition = useMemo(() => randomString(), [
    value,
    disabled,
    dirty,
    invalid,
    object,
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

  const createGetOptionLabel = (labels: Record<string, any>) => (v: string) => labels[v] || '';

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
    const [unfocused, setUnfocused] = useState(true);
    const [value, setValue] = useState(data);

    const handleFocus = () => {
      if (!fieldReadonly) {
        setUnfocused(false);
      }
    };

    const handleBlur = () => {
      if (!fieldReadonly) {
        setUnfocused(true);
        onChange(value);
      }
    };

    const handleChange = (value: any) => {
      setValue(value);
    };

    return (
      <Autocomplete
        value={value || null}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={({ }, v) => handleChange(v)}
        getOptionLabel={(v) => labels[v] || ''}
        options={options}
        disabled={disabled}
        readOnly={unfocused}
        renderInput={createRenderInput(false, unfocused)}
      />
    );
  };

  return (
    <Async Loader={Loader} payload={reloadCondition} fallback={fallback}>
      {async () => {

        const labels: Record<string, string> = {};
        itemList = arrays(itemList) || [];
        const options = Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object)) : itemList);
        await Promise.all(options.map(async (item) => labels[item] = await Promise.resolve(tr(item))));

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
