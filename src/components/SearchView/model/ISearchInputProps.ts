import ISearchViewProps from "./ISearchViewProps";

import TSubject from "../../../model/TSubject";

/**
 * Represents the properties for the SearchInput component.
 */
export interface ISearchInputProps {
  placeholder?: string;
  type: Exclude<ISearchViewProps["type"], undefined>;
  mode: Exclude<ISearchViewProps["mode"], undefined>;
  autoComplete: ISearchViewProps["autoComplete"];
  pattern: ISearchViewProps["pattern"];
  reloadSubject: TSubject<void>;
  onTextChange: (value: string) => void;
  loading: boolean;
  getValue: () => string;
}
export default ISearchInputProps;
