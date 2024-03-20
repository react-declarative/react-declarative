import * as React from "react";
import { useContext } from "react";
import { createContext } from "react";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IOneProps from "../../../model/IOneProps";

const PropsContext = createContext<IOneProps<any, any>>(null as never);

/**
 * Represents the props for the `PropsProvider` component.
 */
interface IPropsProviderProps<
  Data extends IAnything = IAnything,
  Field extends IField<Data> = IField<Data>
> extends IOneProps<Data, Field> {
  children: React.ReactNode;
}

/**
 * Provider component for providing props through context.
 *
 * @template Data - The data type for the props being provided.
 * @template Field - The field type for the props being provided.
 *
 * @param props - The props for the PropsProvider component.
 * @param props.children - The children to be rendered.
 *
 * @returns - The rendered PropsProvider component.
 */
export const PropsProvider = <
  Data extends IAnything = IAnything,
  Field extends IField<Data> = IField<Data>
>({
  children,
  ...props
}: IPropsProviderProps<Data, Field>) => (
  <PropsContext.Provider value={props}>{children}</PropsContext.Provider>
);
export const useOneProps = <Data extends IAnything = IAnything>() =>
  useContext(PropsContext) as IOneProps<Data>;

export default PropsProvider;
