import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

import Breadcrumbs2Type from "./Breadcrumbs2Type";

export interface IBreadcrumbs2Option<Data = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    type: Breadcrumbs2Type;
    isVisible?: (payload: Data) => (Promise<boolean> | boolean);
    isDisabled?: (payload: Data) => (Promise<boolean> | boolean);
};

export default IBreadcrumbs2Option;