import { SxProps } from "@mui/material";

import IOneProps, { OneHandler } from "../../../model/IOneProps";

import { ButtonProps } from "@mui/material/Button";

import IOnePublicProps from "../../../model/IOnePublicProps";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";
import TSubject from "../../../model/TSubject";

/**
 * @interface IOneButtonProps
 * @template Data - The data type of the IField object's data property
 * @template Payload - The payload type of the IField object
 * @property [noBadge] - Determines whether to display a badge on the button. Default is false.
 * @property [fieldDebounce] - The debounce time in milliseconds for field changes. Default is null.
 * @property [waitForChangesDelay] - The delay time in milliseconds to wait for changes before invoking the handler. Default is null.
 * @property fields - An array of IField objects representing the fields associated with the button.
 * @property [payload] - The payload to be passed to the handler when the button is clicked.
 * @property handler - The handler function to be invoked when the button is clicked.
 * @property [onChange] - The change callback function for the button. Default is null.
 * @property [onInvalid] - The invalidity callback function for the button. Default is null.
 * @property [onFocus] - The focus callback function for the button. Default is null.
 * @property [onBlur] - The blur callback function for the button. Default is null.
 * @property [badgeColor] - The color of the badge. Default is 'primary'.
 * @property [badgeOverlap] - The overlap type for the badge. Default is 'rectangular'.
 * @property [badgeSx] - The style for the badge. Default is null.
 * @property [oneSx] - The style for the button. Default is null.
 * @property [color] - The color of the button. Default is 'inherit'.
 */
export interface IOneButtonProps<Data extends {} = IAnything, Payload extends IAnything = IAnything> extends Omit<ButtonProps, keyof {
  onChange: never;
  onClick: never;
  onInvalid: never;
  onFocus: never;
  onBlur: never;
  color: never;
}> {
  reloadSubject?: TSubject<void>;
  withCloseAfterChange?: boolean;
  noBadge?: boolean;
  fieldDebounce?: number;
  waitForChangesDelay?: number;
  fields: IField<Data, Payload>[];
  payload?: (Payload | (() => Payload));
  handler: OneHandler<Data, Payload>;
  onClose?: (data: Data) => void;
  onChange?: IOneProps<Data, Payload>['change'];
  onInvalid?: IOneProps<Data, Payload>['invalidity'];
  onFocus?: IOneProps<Data, Payload>['focus'];
  onBlur?: IOneProps<Data, Payload>['blur'];
  isBaseline?: IOneProps<Data, Payload>['isBaseline'];
  isBaselineForRoot?: IOneProps<Data, Payload>['isBaselineForRoot'];
  readTransform?: IOnePublicProps<Data, Payload>['readTransform'];
  writeTransform?: IOnePublicProps<Data, Payload>['writeTransform'];
  incomingTransform?: IOnePublicProps<Data, Payload>['incomingTransform'];
  outgoingTransform?: IOnePublicProps<Data, Payload>['outgoingTransform'];
  badgeColor?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  badgeOverlap?: "rectangular" | "circular";
  badgeSx?: SxProps<any>;
  oneSx?: SxProps<any>;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export default IOneButtonProps;
