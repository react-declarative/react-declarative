import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import MoreIcon from "@mui/icons-material/ExpandMore";
import LessIcon from "@mui/icons-material/ExpandLess";

import OptionItem from "./OptionItem";

import { IScaffold2OptionInternal } from "../model/IScaffold2Option";

import useStateContext from "../context/StateContext";
import useActualCallback from "../../../hooks/useActualCallback";

interface IMenuOptionProps {
  option: IScaffold2OptionInternal | IScaffold2OptionInternal[];
  disabled?: boolean;
  paddingLeft?: number;
  activeOptionPath: string;
  onClick: (path: string, id: string) => void;
  onGroupClick: (path: string, id: string) => void;
}

const PADDING_LEFT_STEP = 12;

const useLifted = () => {
  const { searchText } = useStateContext();
  return !!searchText;
};

const MenuGroup = ({
  option,
  currentPadding,
  disabled,
  activeOptionPath,
  onClick,
  onGroupClick,
}: {
  option: Required<IScaffold2OptionInternal>;
  activeOptionPath: string;
  onClick: (path: string, id: string) => void;
  onGroupClick: (path: string, id: string) => void;
  disabled: boolean;
  currentPadding: number;
}) => {
  const upperLifted = useLifted();

  const computeLifted = useActualCallback(() => option.lifted || activeOptionPath.includes(option.path));

  const [lifted, setLifted] = useState(computeLifted());

  useEffect(() => {
    if (upperLifted) {
      setLifted(true);
    } else {
      setLifted(computeLifted());
    }
  }, [upperLifted]);

  const icon = lifted
    ? () => <LessIcon />
    : () => <MoreIcon />;

  const handleClick = () => {
    setLifted((lifted) => !lifted);
    onGroupClick(option.path, option.id);
  };

  if (!option.visible) {
    return null;
  }

  return (
    <React.Fragment>
      <OptionItem
        key={option.id}
        option={{
          ...option,
          disabled: option.disabled || disabled,
          icon,
        }}
        activeOptionPath={activeOptionPath}
        onClick={handleClick}
        currentPadding={currentPadding}
      />
      {lifted && (
        <MenuOption
          option={option.options}
          paddingLeft={currentPadding}
          activeOptionPath={activeOptionPath}
          disabled={disabled}
          onClick={onClick}
          onGroupClick={onGroupClick}
        />
      )}
    </React.Fragment>
  );
};

export const MenuOption = ({
  paddingLeft = -PADDING_LEFT_STEP,
  option,
  disabled = false,
  activeOptionPath,
  onClick,
  onGroupClick,
}: IMenuOptionProps) => {

  const options = useMemo(() => Array.isArray(option) ? option : [option], [option]);

  const child = options
    .filter((option) => option.visible)
    .map((option, idx) => {
      const currentPadding = paddingLeft + PADDING_LEFT_STEP;
      if (option.options?.length) {
        return (
          <MenuGroup
            key={`${option.id}-${idx}`}
            option={option as Required<IScaffold2OptionInternal>}
            activeOptionPath={activeOptionPath}
            disabled={disabled}
            onGroupClick={onGroupClick}
            onClick={onClick}
            currentPadding={currentPadding}
          />
        );
      } else if (option.visible) {
        return (
          <OptionItem
            key={`${option.id}-${idx}`}
            option={{
              ...option,
              disabled: disabled || option.disabled,
            }}
            activeOptionPath={activeOptionPath}
            onClick={onClick}
            currentPadding={currentPadding}
          />
        );
      } else {
        return null;
      }
    });

  return <>{child}</>;
};

export default MenuOption;
