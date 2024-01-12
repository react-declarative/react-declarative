import createValueProvider from "../../../utils/createValueProvider";

interface Fn {
  (id: string, fn: () => React.ReactNode | Promise<React.ReactNode>): (React.ReactNode | Promise<React.ReactNode>);
  clear(id?: any): void;
  gc(): void;
}

export const [FetchLabelProvider, useFetchLabel] = createValueProvider<Fn>();

export default useFetchLabel;
