import { SxProps } from "@mui/material";

import IOneProps, { OneHandler } from "../../../model/IOneProps";

import { ButtonProps } from "@mui/material/Button";

import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IOneButtonProps<Data extends {} = IAnything, Payload extends IAnything = IAnything> extends Omit<ButtonProps, keyof {
  onChange: never;
  onClick: never;
  onInvalid: never;
  color: never;
}> {
  noBadge?: boolean;
  waitForChangesDelay?: number;
  fields: IField<Data, Payload>[];
  payload: (Payload | (() => Payload));
  handler: OneHandler<Data, Payload>;
  onChange: IOneProps<Data, Payload>['change'];
  onInvalid: IOneProps<Data, Payload>['invalidity'];
  badgeColor?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  badgeOverlap?: "rectangular" | "circular";
  badgeSx?: SxProps<any>;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export default IOneButtonProps;
