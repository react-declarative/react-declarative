import React from "react";
import { BoxProps } from "@mui/material";

import type TSubject from "../../../model/TSubject";

import ICardViewOperation from "./ICardViewOperation";
import ICardViewAction from "./ICardViewAction";
import IItemData from "./IItemData";

/**
 * Represents the properties for the CardView component.
 *
 * @template ItemData - The type of data for each item in the CardView.
 * @template Payload - The type of payload.
 *
 * @interface ICardViewProps
 * @extends {BoxProps}
 */
export interface ICardViewProps<ItemData extends IItemData = any, Payload extends any = any> extends BoxProps {
    handler: ItemData[] | ((search: string, skip: number) => (ItemData[] | Promise<ItemData[]>));
    scrollXSubject?: TSubject<number>;
    scrollYSubject?: TSubject<number>;
    reloadSubject?: TSubject<void>;
    cardActions?: ICardViewAction<ItemData, Payload>[];
    operations?: ICardViewOperation<ItemData, Payload>[];
    payload?: (() => Payload) | Payload;
    formatMedia?: (item: ItemData) => React.ReactNode;
    formatCardLabel?: (item: ItemData) => React.ReactNode;
    formatKey?: (key: keyof ItemData) => React.ReactNode;
    formatValue?: (key: keyof ItemData, value: ItemData[keyof ItemData]) => React.ReactNode;
    onOperation?: (operation: string, selectedItems: ItemData[], isAllSelected: boolean) => (void | Promise<void>);
    onAction?: (action: string, item: ItemData) => void;
    onCardClick?: (item: ItemData) => void;
    onLoadStart?: () => void;
    pickFields?: (keyof ItemData)[];
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    skipStep?: number;
    throwError?: boolean;
    noSearch?: boolean;
    noFooter?: boolean;
}

export default ICardViewProps;
