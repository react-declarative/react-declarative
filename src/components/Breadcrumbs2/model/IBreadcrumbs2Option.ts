import { SxProps } from "@mui/material";

import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

import Breadcrumbs2Type from "./Breadcrumbs2Type";
import IBreadcrumbs2Action from "./IBreadcrumbs2Action";

/**
 * Represents an option configuration for IBreadcrumbs2 component.
 *
 * @template Data - The type of additional data associated with the option.
 */
export interface IBreadcrumbs2Option<Data = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
    label: never;
}> {
    type: Breadcrumbs2Type;
    label?: React.ReactNode;
    element?: React.ComponentType<{
        payload: Data,
        disabled: boolean;
    }>;
    sx?: SxProps<any>;
    outlined?: boolean;
    actions?: IBreadcrumbs2Action<Data>[];
    buttonVariant?: "text" | "outlined" | "contained";
    buttonColor?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    fabColor?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    compute?: (payload: Data) => (Promise<string> | string);
    isVisible?: (payload: Data) => (Promise<boolean> | boolean);
    isDisabled?: (payload: Data) => (Promise<boolean> | boolean);
};

export default IBreadcrumbs2Option;
