import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import MoreIcon from "@mui/icons-material/ExpandMore";
import LessIcon from "@mui/icons-material/ExpandLess";

import OptionItem from "./OptionItem";

import { IScaffold3OptionInternal } from "../model/IScaffold3Option";

import useActualCallback from "../../../hooks/useActualCallback";

import useStateContext from "../context/StateContext";
import usePropsContext from "../context/PropsContext";
import useHoverContext from "../context/HoverContext";

/**
 * Represents the properties for a menu option.
 *
 * @interface IMenuOptionProps
 */
interface IMenuOptionProps {
  option: IScaffold3OptionInternal | IScaffold3OptionInternal[];
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
  option: Required<IScaffold3OptionInternal>;
  activeOptionPath: string;
  onClick: (path: string, id: string) => void;
  onGroupClick: (path: string, id: string) => void;
  disabled: boolean;
  currentPadding: number;
}) => {
  const upperLifted = useLifted();
  const [hoverPath] = useHoverContext();

  /**
   * Calculates the value of the `nestedLifted` variable based on the current `hoverPath` and `option.path`.
   *
   * If `hoverPath` is an empty string, the value of `nestedLifted` is `false`.
   * If `hoverPath` is equal to `option.path`, the value of `nestedLifted` is `true`.
   * Otherwise, the value of `nestedLifted` is determined by checking if `hoverPath` starts with `option.path`.
   *
   * @returns The calculated value of the `nestedLifted` variable.
   *
   * @param hoverPath - The current hover path
   * @param option.path - The value of the option path
   *
   */
  const nestedLifted = useMemo(() => {
    if (hoverPath === "") {
      return false;
    }
    if (hoverPath === option.path) {
      return true;
    }
    return hoverPath.startsWith(option.path);
  }, [hoverPath]);

  /**
   * Calculate the lifted value based on the specified conditions.
   *
   * @returns The computed lifted value.
   */
  const computeLifted = useActualCallback(
    () => option.lifted || activeOptionPath.includes(option.path)
  );

  const [lifted, setLifted] = useState(computeLifted());

  const { onOptionGroupClick } = usePropsContext();

  useEffect(() => {
    if (upperLifted) {
      setLifted(true);
    } else {
      setLifted(computeLifted());
    }
  }, [upperLifted, activeOptionPath]);

  const defaultIcon = lifted ? () => <LessIcon /> : () => <MoreIcon />;

  /**
   * Function to handle the click event.
   * It updates the value of "lifted" state and calls the onGroupClick function.
   *
   * @function handleClick
   */
  const handleClick = () => {
    setLifted((lifted) => {
      if (onOptionGroupClick) {
        return option.path === activeOptionPath ? !lifted : true;
      }
      return !lifted;
    });
    onGroupClick(option.path, option.id);
  };

  if (!option.visible) {
    return null;
  }

  return (
    <React.Fragment>
      <OptionItem
        key={option.id}
        sx={option.sx}
        option={{
          ...option,
          disabled: option.disabled || disabled,
          icon: option.icon || defaultIcon,
        }}
        activeOptionPath={activeOptionPath}
        onClick={handleClick}
        currentPadding={currentPadding}
      />
      {(lifted || option.pin || nestedLifted) && (
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
  const options = useMemo(
    () => (Array.isArray(option) ? option : [option]),
    [option]
  );

  const child = options
    .filter((option) => option.visible)
    .sort(({ pin: a = false }, { pin: b = false }) => Number(b) - Number(a))
    .map((option, idx) => {
      const currentPadding = paddingLeft + PADDING_LEFT_STEP;
      if (option.options?.length) {
        return (
          <MenuGroup
            key={`${option.id}-${idx}`}
            option={option as Required<IScaffold3OptionInternal>}
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
            sx={option.sx}
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
