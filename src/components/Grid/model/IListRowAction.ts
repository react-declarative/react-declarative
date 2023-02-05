import { IActionMenuProps } from "../../ActionMenu";

import IOption from "../../../model/IOption";

export interface IListRowAction<T>
  extends Omit<
    IOption,
    keyof {
      isVisible: never;
      isDisabled: never;
    }
  > {
  isVisible?: (row: T, payload: IActionMenuProps['payload']) => boolean;
  isDisabled?: (row: T, payload: IActionMenuProps['payload']) => boolean;
}

export default IListRowAction;
