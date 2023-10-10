import { useMemo } from "react";

import { useFeatureView } from "../../FeatureView";

import createLsManager from "../../../utils/createLsManager";
import reloadPage from "../../../utils/reloadPage";

import IColumn from "../../../model/IColumn";

interface IParams {
    fullScreen?: boolean;
    storageKey: string;
    columns: IColumn[];
}

export const useColumnConfig = ({
    storageKey,
    fullScreen = true,
    columns: upperColumns,
}: IParams) => {

    const fields = useMemo(() => upperColumns.map(({ field }) => field as string).filter(v => v), []);

    const columnsManager = useMemo(() => {
        const manager = createLsManager<string[]>(storageKey);
        if (manager.getValue() === null) {
            manager.setValue(fields.reduce<string[]>((acm, field) => [...acm, field], []))
        }
        return manager;
    }, []);

    const fieldsSet = useMemo(() => new Set(columnsManager.getValue()), []);
    const columns = useMemo(() => upperColumns.filter(({ field }) => field && fieldsSet.has(field)), []);

    const {
        open,
        pickData,
        render,
    } = useFeatureView({
        fullScreen,
        handler: () => fields.reduce<Record<string, boolean>>((acm, cur) => ({...acm, [cur]: fieldsSet.has(cur)}), {}),
        features: [
            {
                title: 'Column configuration',
                expanded: true,
                children: columns.map(({
                    field,
                    headerName,
                }) => ({
                    name: `${field}`,
                    label: headerName,
                    description: field,
                })),
            }
        ],
        onSubmit: (data: Record<string, boolean> | null) => {
            if (!data) {
                return true;
            }
            columnsManager.setValue(Object.entries(data).filter(([, value]) => value).map(([key]) => key));
            reloadPage();
            return true;
        }
    });

    const resultColumns = useMemo(() => upperColumns.filter(({ field }) => {
        if (!field) {
            return true;
        }
        return fieldsSet.has(field);
    }), []);

    return {
        open,
        columns: resultColumns,
        pickColumns: pickData,
        render,
    };
};

export default useColumnConfig;
