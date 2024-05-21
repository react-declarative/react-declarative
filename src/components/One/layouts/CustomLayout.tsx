import * as React from "react";
import { useMemo } from "react";

import { makeStyles } from '../../../styles';

import Box from "@mui/material/Box";

import { useOneState } from "../context/StateProvider";
import { useOnePayload } from "../context/PayloadProvider";

import classNames from "../../../utils/classNames";

import IField from "../../../model/IField";
import IEntity from "../../../model/IEntity";
import IAnything from "../../../model/IAnything";
import IManaged, { IWrappedLayout, PickProp } from "../../../model/IManaged";

import makeLayout from "../components/makeLayout/makeLayout";

export interface ICustomLayoutProps<Data = IAnything, Payload = IAnything>
  extends IWrappedLayout<Data, Payload> {
  className?: PickProp<IField<Data, Payload>, "className">;
  style?: PickProp<IField<Data, Payload>, "style">;
  sx?: PickProp<IField<Data, Payload>, "sx">;
  customLayout?: PickProp<IField<Data, Payload>, "customLayout">;
  hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
}

type FieldIgnoreParam = keyof Omit<IManaged, keyof IField> | "readonly";

const FIELD_INTERNAL_PARAMS: FieldIgnoreParam[] = [
  "dirty",
  "fallback",
  "readonly",
  "invalid",
  "loading",
  "object",
  "onChange",
  "prefix",
  "value",
];

/**
 * An interface representing a custom layout private.
 *
 * @template Data - Type for the data of the entity.
 * @extends {IEntity<Data>}
 */
interface ICustomLayoutPrivate<Data = IAnything> extends IEntity<Data> {
  children?: React.ReactNode;
}

/**
 * The useStyles variable is a function that returns an object containing CSS styles.
 *
 * @type {function(): object}
 * @return {object} The object containing CSS styles.
 */
const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    },
});

const Fragment = ({ children }: React.PropsWithChildren<{}>) => <>{children}</>;

/**
 * Represents a custom layout component.
 *
 * @template Data - The type of data to be rendered in the layout.
 *
 * @param props - The component props.
 * @param props.children - The children to be rendered inside the layout.
 * @param props.className - The CSS class name for the layout.
 * @param props.style - The inline styles for the layout.
 * @param props.sx - The theme styling object for the layout (sx prop from Theme-UI).
 * @param props.customLayout - The custom layout component to be used (defaults to Fragment).
 * @param props.otherProps - Other props specific to the custom layout.
 *
 * @returns The rendered custom layout component.
 */
export const CustomLayout = <Data extends IAnything = IAnything>({
  children,
  className,
  style,
  sx,
  testId,
  customLayout: CustomLayout = Fragment,
  ...otherProps
}: ICustomLayoutProps<Data> & ICustomLayoutPrivate<Data>) => {
  const { classes } = useStyles();
  const { object, changeObject: handleChange } = useOneState<any>();
  const _payload = useOnePayload();

  const props = useMemo(() => {
    const _fieldParams = Object.entries(otherProps as IField)
      .filter(
        ([key]) => !FIELD_INTERNAL_PARAMS.includes(key as FieldIgnoreParam)
      )
      .reduce((acm, [key, value]) => ({ ...acm, [key]: value }), {}) as IField;
    return {
      ...object,
      onChange: handleChange,
      _fieldParams,
      _fieldData: object,
      _payload,
    };
  }, [object]);

  return (
    <Box className={classNames(className, classes.root)} data-testid={testId} style={style} sx={sx}>
        <CustomLayout {...props}>
            {children}
        </CustomLayout>
    </Box>
  );
};

CustomLayout.displayName = "CustomLayout";

export default makeLayout(CustomLayout) as typeof CustomLayout;
