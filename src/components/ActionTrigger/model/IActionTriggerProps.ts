import IActionTrigger from "./IActionTrigger";

import { ButtonProps } from '@mui/material/Button';
import { BoxProps } from '@mui/material/Box';

import { IAsyncProps } from "../../Async";

export interface IActionTriggerProps<T extends any = object> extends Omit<IAsyncProps<T>, keyof {
    Loader: never;
    Error: never;
    children: never;
}>, Omit<BoxProps, keyof {
    onChange: never;
    onLoadStart: never;
    children: never;
}> {
    actions: IActionTrigger[];
    onAction?: (action: string) => (void | Promise<void>);
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
};

export default IActionTriggerProps;
