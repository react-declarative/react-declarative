import { IBoardRow } from "../../..";
import IAnything from "../../../model/IAnything";

export interface IBoardRowInternal<Data = IAnything, Payload = IAnything> extends Omit<IBoardRow<Data, Payload>, keyof {
    value: never;
    visible: never;
}> {
    value: React.ReactNode;
    visible: boolean;
}

export default IBoardRowInternal;
