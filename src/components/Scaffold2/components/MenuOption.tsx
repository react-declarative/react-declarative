import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import MoreIcon from "@mui/icons-material/ExpandMore";
import LessIcon from "@mui/icons-material/ExpandLess";

import OptionItem from "./OptionItem";

import { IScaffold2OptionInternal } from "../model/IScaffold2Option";

import useStateContext from "../context/StateContext";

interface IMenuOptionProps {
  option: IScaffold2OptionInternal | IScaffold2OptionInternal[];
  disabled?: boolean;
  paddingLeft?: number;
  onClick: (name: string) => void;
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
  onClick,
}: {
  option: Required<IScaffold2OptionInternal>;
  onClick: (name: string) => void;
  disabled: boolean;
  currentPadding: number;
}) => {
  const upperLifted = useLifted();

  const [lifted, setLifted] = useState(option.lifted || false);

  useEffect(() => {
    if (upperLifted) {
      setLifted(true);
    } else {
      setLifted(option.lifted || false);
    }
  }, [upperLifted]);

  const icon = lifted
    ? () => <LessIcon />
    : () => <MoreIcon />;

  const handleClick = () => {
    setLifted((lifted) => !lifted);
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
        onClick={handleClick}
        currentPadding={currentPadding}
      />
      {lifted && (
        <MenuOption
          option={option.options}
          paddingLeft={currentPadding}
          disabled={disabled}
          onClick={onClick}
        />
      )}
    </React.Fragment>
  );
};

export const MenuOption = ({
  paddingLeft = -PADDING_LEFT_STEP,
  option,
  disabled = false,
  onClick,
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
            disabled={disabled}
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
