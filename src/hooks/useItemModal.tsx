import * as React from "react";

import ItemModal, { IItemModalProps } from "../components/common/ItemModal";

import { useModalManager } from "../components/ModalManager";
import useActualValue from "./useActualValue";

const Bootstrap = (props: IItemModalProps) => (
    <ItemModal
        {...props}
    />
);

interface IParams extends IItemModalProps {
    payload: Record<string, unknown>;
    _autofocusDelay?: number;
}

export const useItemModal = (params: IParams) => {
    const { push } = useModalManager();
    const params$ = useActualValue(params);
    return () => {
        push({
            id: "item-modal",
            render: () => <Bootstrap {...params$.current} />,
        });
    };
}

export default useItemModal;
