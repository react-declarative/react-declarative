import * as React from "react";
import { useCallback, useMemo } from "react";

import { ITile, ITileProps } from "../../../Tile";
import { useOffsetPaginator } from "../../../Grid";

import useActualCallback from "../../../../hooks/useActualCallback";
import useActualState from "../../../../hooks/useActualState";
import useSubject from "../../../../hooks/useSubject";

import { useModalManager } from "../../../ModalManager";

import CheckboxItem from "../components/CheckboxItem";
import RadioItem from "../components/RadioItem";
import TextItem from "../components/TextItem";

import SelectionMode from "../../../../model/SelectionMode";
import IAnything from "../../../../model/IAnything";
import FieldType from "../../../../model/FieldType";
import IManaged from "../../../../model/IManaged";
import TSubject from "../../../../model/TSubject";
import IField from "../../../../model/IField";

import compareFulltext from "../../../../utils/compareFulltext";
import debounce from "../../../../utils/hof/debounce";

const SEARCH_DEBOUNCE = 1_000;
const PAGINATOR_LIMIT = 10_000;

interface IResult {
    items: IItem[];
    hasMore: boolean;
    loading: boolean;
    onSkip: () => void;
    searchText: string;
    selectedRows: string[];
    selectionMode: SelectionMode;
    reloadSubject: TSubject<void>;
    beginSubmit: () => void;
    cancelSubmit: () => void;
    setSearchText: (text: string) => void;
    onItemClick: Exclude<ITileProps['onItemClick'], undefined>;
    onSelectedRows: Exclude<ITileProps['onSelectedRows'], undefined>;
    renderItem: Exclude<ITileProps['children'], undefined>;
}

interface IParams {
    type: Exclude<IField['type'], undefined>;
    onValueChange: Exclude<IManaged['onChange'], undefined>;
    keepRaw?: IField['keepRaw'];
    value: string | string[] | null;
    data: IAnything;
    payload: IAnything;
    tip?: IField['tip'];
    tr?: IField['tr'];
    itemList?: IField['itemList'];
}

interface IItem {
    id: string;
    label: string;
}

const resolveItemList = async ({
    data,
    payload,
    itemList,
    tr = (v) => v,
}: {
    data: IAnything;
    payload: IAnything;
    itemList?: IField['itemList'];
    tr?: IField['tr'];
}) => {
    const result = typeof itemList === 'function' ? await itemList(data, payload) : itemList!;
    return await Promise.all(result.map(async (value) => ({
        id: value,
        label: await tr(value, data, payload),
    })))
};

const resolveTr = async ({
    tip,
    searchText,
    data,
    payload,
}: {
    searchText: string;
    data: IAnything;
    payload: IAnything;
    tip?: IField['tip'];
}) => {
    const result = typeof tip === 'function' ? await tip(searchText, data, payload) : tip!;
    return result.map((value) => ({
        id: value,
        label: value,
    }));
};

export const useViewState = ({
    data,
    type,
    payload,
    value,
    itemList,
    tip,
    tr,
    keepRaw = false,
    onValueChange,
}: IParams): IResult => {
    const reloadSubject = useSubject<void>();
    const { clear } = useModalManager();

    const [searchText$, setSearchText] = useActualState(() => typeof value === "string" ? value : "");
    const [selectedRows$, setSelectedRows] = useActualState(() => Array.isArray(value) ? value : []);

    const getItems$ = useActualCallback(async () => {
        const seen = new Set<string>();
        if (tip) {
            const result = await resolveTr({
                tip,
                data,
                payload,
                searchText: searchText$.current,
            });
            return result.filter(({ id }) => {
                if (seen.has(id)) {
                    return false;
                }
                return true;
            });
        }
        if (itemList) {
            const result = await resolveItemList({
                data,
                payload,
                itemList,
                tr,
            });
            return result.filter(({ id }) => {
                if (seen.has(id)) {
                    return false;
                }
                return true;
            });
        }
        return [];
    });

    const getValue = useCallback(() => {
        if (type === FieldType.Items || type === FieldType.Combo) {
            return selectedRows$.current.length ? selectedRows$.current : null;
        }
        return searchText$.current;
    }, []);

    const { data: items, hasMore, loading, onSkip } = useOffsetPaginator<IItem>({
        handler: async () => {
            const items = await getItems$();
            if (tip) {
                return keepRaw ? items : items.filter((item) => compareFulltext(item, searchText$.current, 'label'));
            }
            return items.filter((item) => compareFulltext(item, searchText$.current, 'label'));
        },
        limit: PAGINATOR_LIMIT,
        reloadSubject,
    });

    const emitChangeSearch = useMemo(
        () =>
            debounce(() => {
                reloadSubject.next();
            }, SEARCH_DEBOUNCE),
        []
    );

    const selectionMode = useMemo(() => {
        if (type === FieldType.Items) {
            return SelectionMode.Multiple;
        }
        if (type === FieldType.Combo) {
            return SelectionMode.Single;
        }
        return SelectionMode.None;
    }, []);

    const beginSubmit = useCallback(() => {
        onValueChange(getValue(), {
            skipReadonly: true,
        });
        clear();
    }, []);

    return {
        items,
        hasMore,
        loading,
        onSkip,
        selectionMode,
        reloadSubject,
        onItemClick: useCallback(({ data, toggleSelection }) => {
            if (type === FieldType.Complete) {
                setSearchText(data.value);
                beginSubmit();
                return;
            }
            toggleSelection();
        }, []),
        onSelectedRows: useCallback((rowIds, initial) => {
            if (initial) {
                return;
            }
            setSelectedRows(rowIds);
        }, []),
        renderItem: useCallback((props: ITile<IItem>) => {
            if (type === FieldType.Items) {
                return <CheckboxItem {...props} />
            }
            if (type === FieldType.Combo) {
                return <RadioItem {...props} />
            }
            return <TextItem {...props} />
        }, []),
        searchText: searchText$.current,
        selectedRows: selectedRows$.current,
        setSearchText: useCallback((searchText) => {
            setSearchText(searchText);
            emitChangeSearch();
        }, []),
        beginSubmit,
        cancelSubmit: useCallback(() => {
            clear();
        }, []),
    }
};

export default useViewState;
