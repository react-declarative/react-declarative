import * as React from "react";
import { Suspense, lazy } from "react";

import LoaderView from "../components/LoaderView";

/**
 * An interface representing the parameters for a loader.
 *
 * @interface
 */
interface IParams {
  loaderSize: number;
}

const DEFAULT_LOADER_SIZE = 48;

/**
 * Wraps a React component with lazy loading and suspense, displaying a loader while the component is being loaded.
 *
 * @template T - The type of the wrapped React component.
 * @template P - The props type of the wrapped React component.
 *
 * @param factory - A function that returns a promise that resolves to the component.
 * @param [options={}] - Optional parameters for customizing the loader.
 *
 * @returns A function that returns the wrapped component with suspense and loader.
 */
export const heavy = <T extends React.ComponentType<P>, P extends object = any>(
  factory: () => Promise<{ default: T }>,
  { loaderSize = DEFAULT_LOADER_SIZE }: Partial<IParams> = {}
) => {
  const Component = lazy<any>(factory);
  return (props: P) => (
    <Suspense
      fallback={
        <LoaderView sx={{ width: "100%", height: "80vh" }} size={loaderSize} />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default heavy;
