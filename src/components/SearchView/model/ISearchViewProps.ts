import { SxProps } from "@mui/material";

import { TextFieldProps } from "@mui/material/TextField";

import ISearchItem from "./ISearchItem";
import IAnything from "../../../model/IAnything";
import ISearchItemProps from "./ISearchItemProps";

export type ISearchViewProps<Data extends IAnything = IAnything, Payload = IAnything> = Omit<
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
    inputProps: never;
  }
> & {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  fullWidth?: boolean;
  SearchItem?: React.ComponentType<ISearchItemProps<Data>>;
  CreateButton?: React.ComponentType<{}>;
  payload?: Payload | (() => Payload);
  value?: ISearchItem<Data> | null | (() => null | ISearchItem<Data> | Promise<null | ISearchItem<Data>>);
  type?: keyof {
    date: string;
    email: string;
    number: string;
    search: never;
    tel: never;
    text: never;
    time: never;
    url: never;
    week: never;
  };
  mode?: keyof {
    none: never;
    text: never;
    tel: never;
    url: never;
    email: never;
    numeric: never;
    decimal: never;
    search: never;
  };
  pattern?: string;
  handler: (
    search: string,
    limit: number,
    offset: number,
    initial: boolean,
    currentRows: ISearchItem<Data>[]
  ) => ISearchItem<Data>[] | Promise<ISearchItem<Data>[]>;
  onChange?: (value: ISearchItem<Data> | null) => void;
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
