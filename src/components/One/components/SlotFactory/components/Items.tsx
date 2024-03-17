import * as React from 'react';
import { useMemo, useState, useRef, useEffect } from 'react';

import { AutocompleteRenderGetTagProps, AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import Autocomplete from "@mui/material/Autocomplete";

import CircularProgress from "@mui/material/CircularProgress";
import MatTextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import Chip from "@mui/material/Chip";

import VirtualListBox from '../../common/VirtualListBox';

import compareArray from '../../../../../utils/compareArray';
import debounce from '../../../../../utils/hof/debounce';
import isObject from '../../../../../utils/isObject';

import { useOneState } from '../../../context/StateProvider';
import { useOneProps } from '../../../context/PropsProvider';
import { useOnePayload } from '../../../context/PayloadProvider';
import { useOneMenu } from '../../../context/MenuProvider';

import { useSubject } from '../../../../../hooks/useSubject';
import { useAsyncAction } from '../../../../../hooks/useAsyncAction';
import { useActualValue } from '../../../../../hooks/useActualValue';
import { useRenderWaiter } from '../../../../../hooks/useRenderWaiter';
import { useReloadTrigger } from '../../../../../hooks/useReloadTrigger';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import { IItemsSlot } from '../../../slots/ItemsSlot';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EMPTY_ARRAY = [] as any;
const MOUSE_OUT_DEBOUNCE = 45;

const getArrayHash = (value: any) =>
    Object.values<string>(value || {})
        .sort((a, b) => b.localeCompare(a))
        .join('-');

interface IState {
    options: string[];
    labels: Record<string, string>;
}

/**
 * @param Items - The main function that renders the Autocomplete component.
 * @param Items.value - The value of the autocomplete field. It can be a string or an object.
 * @param Items.disabled - Determines whether the autocomplete field is disabled or not.
 * @param Items.readonly - Determines whether the autocomplete field is readonly or not.
 * @param Items.description - The description of the autocomplete field.
 * @param Items.placeholder - The placeholder text of the autocomplete field.
 * @param Items.outlined - Determines whether the autocomplete field has an outlined style or not.
 * @param Items.itemList - The list of items to be populated in the autocomplete dropdown.
 * @param Items.freeSolo - Determines whether the user can input values that are not in the itemList.
 * @param Items.noDeselect - Determines whether the user can deselect values in the autocomplete field.
 * @param Items.virtualListBox - Determines whether to use a virtual listbox for rendering the autocomplete dropdown.
 * @param Items.watchItemList - Determines whether to watch for changes in the itemList.
 * @param Items.labelShrink - Determines whether to shrink the label when the autocomplete field has a value.
 * @param Items.dirty - Determines whether the autocomplete field has been modified.
 * @param Items.invalid - Determines whether the autocomplete field has an invalid value.
 * @param Items.incorrect - Determines whether the autocomplete field has an incorrect value.
 * @param Items.title - The title text of the autocomplete field.
 * @param Items.tr - A translation function that takes a string and returns a translated string.
 * @param Items.onChange - A callback function that is called when the value of the autocomplete field changes.
 * @param Items.withContextMenu - Determines whether to show a context menu for the autocomplete field.
 * @returns The Autocomplete component.
 */
export const Items = ({
    value: upperValue,
    disabled,
    readonly,
    description,
    placeholder,
    outlined = false,
    itemList = [],
    freeSolo,
    noDeselect,
    virtualListBox,
    watchItemList,
    labelShrink,
    dirty,
    invalid,
    incorrect,
    title,
    tr = (s) => s.toString(),
    onChange,
    withContextMenu,
}: IItemsSlot) => {

    const { requestSubject } = useOneMenu();

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

    const arrayValue = useMemo(() => {
        if (typeof upperValue === 'string') {
            return [upperValue];
        }
        if (upperValue) {
            const result = Object.values<string>(upperValue);
            return isObject(result) ? [] : result;
        }
        return [];
    }, [upperValue]);

    const prevValue = useRef(arrayValue);

    const value = useMemo(() => {
        if (compareArray(prevValue.current, arrayValue)) {
            return prevValue.current;
        }
        prevValue.current = arrayValue;
        return arrayValue;
    }, [arrayValue]);

    const value$ = useActualValue(value);

    const {
        fallback,
    } = useOneProps();

    const {
        loading,
        execute,
    } = useAsyncAction(async (object) => {
        const labels: Record<string, string> = {};
        itemList = itemList || [];
        const options: string[] = [...new Set(Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object, payload)) : itemList))];
        await Promise.all(options.map(async (item) => labels[item] = await Promise.resolve(tr(item, object, payload))));
        if (freeSolo) {
            value.forEach((item) => {
                if (!options.includes(item)) {
                    options.push(item);
                }
            });
        }
        setState({ options, labels });
        initComplete.current = true;
        await waitForRender();
    }, {
        fallback,
    });

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
    }, [
        valueHash,
        disabled,
        dirty,
        invalid,
        incorrect,
        object,
        readonly,
    ]);

    const changeSubject = useSubject<void>();

    useEffect(() => {
        if (!opened) {
            return;
        }
        let unsubscribeRef = changeSubject.once(() => {
            const handler = debounce(({ clientX, clientY }: MouseEvent) => {
                const target = document.elementFromPoint(clientX, clientY);
                if (!target?.closest('.MuiAutocomplete-popper')) {
                    setOpened(false);
                    doReload();
                }
            }, MOUSE_OUT_DEBOUNCE);
            document.addEventListener('mousemove', handler);
            unsubscribeRef = () => {
                document.removeEventListener('mousemove', handler);
                handler.clear();
            };
        });
        return () => unsubscribeRef();
    }, [opened]);

    useEffect(() => withContextMenu && requestSubject.subscribe(() => {
        setOpened(false);
    }), []);

    const handleChange = (value: any) => {
        onChange(value?.length ? value : null);
        changeSubject.next();
    };

    const renderTags = (value: any[], getTagProps: AutocompleteRenderGetTagProps) => {
        const { current: labels } = labels$;
        return value.map((option: string, index: number) => (
            <Chip
                variant={outlined ? "outlined" : "filled"}
                label={freeSolo ? option : (labels[option] || `${option} (unknown)`)}
                {...getTagProps({ index })}
            />
        ))
    };

    const getOptionLabel = (v: string) => {
        const { current: labels } = labels$;
        if (freeSolo) {
            return v;
        }
        return labels[v] || `${v} (unknown)`;
    };

    const createRenderInput = (loading: boolean, readonly: boolean) => (params: AutocompleteRenderInputParams) => (
        <MatTextField
            {...params}
            sx={{
                ...(!outlined && {
                    position: 'relative',
                    mt: 1,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '100%',
                    },
                })
            }}
            variant={outlined ? "outlined" : "standard"}
            label={title}
            helperText={(dirty && (invalid || incorrect)) || description}
            placeholder={loading ? undefined : value$.current.length ? undefined : placeholder}
            error={dirty && (invalid !== null || incorrect !== null)}
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
            InputLabelProps={{
                ...params.InputLabelProps,
                ...(labelShrink && { shrink: true }),
            }}
        />
    );

    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState) => {
        const { current: labels } = labels$;
        return (
            <li {...props}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={state.selected}
                />
                {freeSolo ? option : (labels[option] || `${option} (unknown)`)}
            </li>
        );
    };

    if (loading || !initComplete.current) {
        return (
            <Autocomplete
                multiple
                disableCloseOnSelect
                disableClearable={noDeselect}
                loading
                disabled
                freeSolo={freeSolo}
                onChange={() => null}
                value={EMPTY_ARRAY}
                options={EMPTY_ARRAY}
                ListboxComponent={virtualListBox ? VirtualListBox : undefined}
                getOptionLabel={getOptionLabel}
                renderTags={renderTags}
                renderInput={createRenderInput(true, true)}
                renderOption={renderOption}
            />
        );
    }

    return (
        <Autocomplete
            key={reloadTrigger}
            multiple
            loading={loading}
            disabled={disabled}
            disableCloseOnSelect
            disableClearable={noDeselect}
            freeSolo={freeSolo}
            readOnly={readonly}
            open={opened}
            onChange={({ }, value) => handleChange(value)}
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            getOptionLabel={getOptionLabel}
            ListboxComponent={virtualListBox ? VirtualListBox : undefined}
            value={value}
            options={state.options}
            renderTags={renderTags}
            renderInput={createRenderInput(false, !!readonly)}
            renderOption={renderOption}
        />
    );
};

export default Items;
