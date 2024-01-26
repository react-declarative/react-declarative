import ISearchViewProps from "./ISearchViewProps";

import TSubject from "../../../model/TSubject";

export interface ISearchInputProps {
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
