import * as React from "react";
import { useContext } from "react";

import DisplayMode from "../../../../../../model/DisplayMode";

import IAnything from "../../../../../../model/IAnything";
import IRowData from "../../../../../../model/IRowData";

import SlotContext from "../../SlotContext";

import { IBodyRowSlot } from "../../../../slots/BodyRowSlot";

import useProps from "../../../../hooks/useProps";

export const BodyRow = <RowData extends IRowData = IAnything>(
  props: IBodyRowSlot<RowData>
) => {
  const { withMobile = false } = useProps();
  const { MobileBodyRow, DesktopBodyRow } = useContext(SlotContext);
  if (props.mode === DisplayMode.Phone && withMobile) {
    return <MobileBodyRow {...props} />;
  } else {
    return <DesktopBodyRow {...props} />;
  }
};

export default BodyRow;
