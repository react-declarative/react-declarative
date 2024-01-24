import { SxProps } from "@mui/material";

import { TextFieldProps } from "@mui/material/TextField";

import ISearchItem from "./ISearchItem";
import IAnything from "../../../model/IAnything";
import ISearchItemProps from "./ISearchItemProps";

export type ISearchViewProps<T extends IAnything = IAnything> = Omit<
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
  SearchItem?: React.ComponentType<ISearchItemProps<T>>;
  value?: ISearchItem<T> | (() => ISearchItem<T> | Promise<ISearchItem<T>>);
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
    currentRows: ISearchItem<T>[]
  ) => ISearchItem<T>[] | Promise<ISearchItem<T>[]>;
  onChange?: (value: ISearchItem<T> | null) => void;
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
