import { useMemo } from "react";

import compareCords from "../utils/compareCords";

import useActualValue from "../../../hooks/useActualValue";

import ICord, { ICordInternal } from "../model/ICord";

interface IResult {
    commitChange: (dto: ICord | ICordInternal) => void;
    getValue: () => ICord[];
}

export const useCordCache = (upperCords: ICord[]): IResult => {
    const upperCords$ = useActualValue(upperCords);
    return useMemo(() => new class {
        _cords: ICord[] = upperCords$.current.map((cord) => ({ ...cord }));
        commitChange = (dto: ICord | ICordInternal) => {
            const target = this._cords.find(({ id }) => dto.id === id);
            target && Object.assign(target, dto);
        };
        getValue = () => {
            if (compareCords(this._cords, upperCords$.current)) {
                return this._cords;
            }
            return this._cords = upperCords$.current.map((cord) => ({ ...cord }));
        };
    }, []);
}

export default useCordCache;
