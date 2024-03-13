import { SxProps } from "@mui/material";

import IOneProps, { OneHandler } from "../../../model/IOneProps";

import { IconButtonProps } from "@mui/material/IconButton";

import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Represents the properties of a context menu button component.
 *
 * @template Data - The type of data associated with the button.
 * @template Payload - The type of payload associated with the button.
 */
export interface IOneButtonProps<Data extends {} = IAnything, Payload extends IAnything = IAnything> extends Omit<IconButtonProps, keyof {
  onChange: never;
  onClick: never;
  onInvalid: never;
  onFocus: never;
  onBlur: never;
  color: never;
}> {
  noBadge?: boolean;
  fieldDebounce?: number;
  waitForChangesDelay?: number;
  fields: IField<Data, Payload>[];
  payload?: (Payload | (() => Payload));
  handler: OneHandler<Data, Payload>;
  onChange?: IOneProps<Data, Payload>['change'];
  onInvalid?: IOneProps<Data, Payload>['invalidity'];
  onFocus?: IOneProps<Data, Payload>['focus'];
  onBlur?: IOneProps<Data, Payload>['blur'];
  badgeColor?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  badgeOverlap?: "rectangular" | "circular";
  badgeSx?: SxProps<any>;
  oneSx?: SxProps<any>;
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default IOneButtonProps;
