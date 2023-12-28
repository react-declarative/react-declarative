import { SxProps } from "@mui/material";

import IVisibilityGroup from "./IVisibilityGroup";

import TSubject from "../../../model/TSubject";

export interface IVisibilityViewProps {
  changeSubject?: TSubject<any>;
  outlinePaper?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  expandAll?: boolean;
  readonly?: boolean;
  data?: Record<string, string[]> | null;
  onChange?: (data: Record<string, string[]>) => void;
  groups: IVisibilityGroup[];
  keyToTitle?: (name: string) => string;
}

export default IVisibilityViewProps;
