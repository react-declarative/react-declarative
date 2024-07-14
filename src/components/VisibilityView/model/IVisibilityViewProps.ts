import { SxProps } from "@mui/material";

import IVisibilityGroup from "./IVisibilityGroup";

import type TSubject from "../../../model/TSubject";

/**
 * Interface representing the props for the VisibilityView component.
 */
export interface IVisibilityViewProps {
  changeSubject?: TSubject<any>;
  outlinePaper?: boolean;
  transparentPaper?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  expandAll?: boolean;
  readonly?: boolean;
  data?: Record<string, string[]> | null;
  ignore?: (key: string) => boolean;
  onChange?: (data: Record<string, string[]>) => void;
  groups: IVisibilityGroup[];
  keyToTitle?: (name: string) => string;
}

export default IVisibilityViewProps;
