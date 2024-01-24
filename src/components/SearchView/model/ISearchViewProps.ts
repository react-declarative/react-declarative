import { SxProps } from "@mui/material";

import { TextFieldProps } from "@mui/material/TextField";

import ISearchItem from "./ISearchItem";

export type ISearchViewProps = Omit<
  TextFieldProps,
  keyof {
    value: never;
    onChange: never;
    className: never;
    style: never;
    sx: never;
    ref: never;
    onClick: never;
    disabled: never;
    InputProps: never;
  }
> & {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  fullWidth?: boolean;
  value?: ISearchItem | (() => ISearchItem | Promise<ISearchItem>);
  type?:
    | "date"
    | "email"
    | "number"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  handler: (
    search: string,
    limit: number,
    offset: number,
    initial: boolean,
    currentRows: ISearchItem[]
  ) => ISearchItem[] | Promise<ISearchItem[]>;
  onChange?: (value: ISearchItem | null) => void;
  onCreate?: (value: string) => void;
  onTextChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  delay?: number;
  limit?: number;
  variant?: "standard" | "outlined" | "filled";
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  throwError?: boolean;
};

export default ISearchViewProps;
