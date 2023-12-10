import { IActionMenuProps } from "../../ActionMenu";

import IOption from "../../../model/IOption";

export interface IGridAction<T>
  extends Omit<
    IOption,
    keyof {
      isVisible: never;
      isDisabled: never;
    }
  > {
  isVisible?: (row: T, payload: IActionMenuProps['payload']) => (boolean | Promise<boolean>);
  isDisabled?: (row: T, payload: IActionMenuProps['payload']) => (boolean | Promise<boolean>);
}

export default IGridAction;
