import * as React from "react";
import { Suspense, lazy } from "react";

import LoaderView from "../components/LoaderView";

interface IParams {
  loaderSize: number;
}

const DEFAULT_LOADER_SIZE = 48;

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
