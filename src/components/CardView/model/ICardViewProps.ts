import { BoxProps } from "@mui/system";

import TSubject from "../../../model/TSubject";

import IItemData from "./IItemData";

export interface ICardViewProps<ItemData extends IItemData = any> extends BoxProps {
    handler: ItemData[] | ((search: string, skip: number) => (ItemData[] | Promise<ItemData[]>));
    scrollXSubject?: TSubject<number>;
    scrollYSubject?: TSubject<number>;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    skipStep?: number;
    throwError?: boolean;
}

export default ICardViewProps;
