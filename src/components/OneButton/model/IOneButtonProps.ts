import { SxProps } from "@mui/material";

import IOneProps, { OneHandler } from "../../../model/IOneProps";

import { ButtonProps } from "@mui/material/Button";

import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IOneButtonProps<Data extends {} = IAnything, Payload extends IAnything = IAnything> extends Omit<ButtonProps, keyof {
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
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export default IOneButtonProps;
