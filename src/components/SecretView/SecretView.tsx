import * as React from "react";
import { useEffect } from "react";

import { SxProps } from "@mui/material";

import ModalDialog from "../common/ModalDialog";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";

import useActualCallback from "../../hooks/useActualCallback";
import useActualState from "../../hooks/useActualState";

const DEFAULT_TOTAL_DIGITS = 6;

const CODE_APPROVE_DELAY = 500;

const DIGIT_SET = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

const INITIAL_STATE: IState = {
  value: '',
  open: false,
  approved: false,
};

const DIALOG_CONTAINER = 'MuiDialog-container';

/**
 * Interface for the SecretView component props.
 */
interface ISecretViewProps {
  children?: React.ReactNode;
  onCode?: (code: number) => void;
  enabled?: boolean;
  title?: string;
  description?: string;
  digits?: number;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
}

/**
 * Interface representing the state of an entity.
 * @interface
 */
interface IState {
  value: string;
  open: boolean;
  approved: boolean;
}

/**
 * Represents a component that displays a secret view with an input for entering a code.
 *
 * @param className - The class name for the component.
 * @param style - The inline styles for the component.
 * @param sx - The sx styles for the component.
 * @param children - The child components to be rendered.
 * @param enabled - Whether the secret view is enabled or disabled. Default is true.
 * @param title - The title for the secret view. Default is "Service menu".
 * @param description - The description for the secret view. Default is "Please type a secret\ncode to continue".
 * @param digits - The total number of digits for the code. Default is DEFAULT_TOTAL_DIGITS.
 * @param onCode - The callback function to be called when the code is entered.
 * @returns - The rendered secret view component.
 */
export const SecretView = ({
  className,
  style,
  sx,
  children,
  enabled = true,
  title = "Service menu",
  description = "Please type a secret\ncode to continue",
  digits = DEFAULT_TOTAL_DIGITS,
  onCode,
}: ISecretViewProps) => {
  
  const [state, setState] = useActualState(INITIAL_STATE);

  /**
   * Handles the close action by updating the component state.
   * It sets the component state to the initial state defined in the 'INITIAL_STATE' constant.
   *
   * @function
   */
  const handleClose = () => setState({
    ...state.current,
    ...INITIAL_STATE,
  });

  useEffect(() => {
    if (!enabled) {
      handleClose();
    }
  }, [enabled]);

  /**
   * Sets the value of `open` in the state.
   *
   * @param open - The new value of `open`.
   * @returns
   */
  const setOpen = (open: boolean) => setState({
    ...state.current,
    open,
  });

  /**
   * Sets the value of the current state object to the given value.
   *
   * @param value - The value to assign to the state object.
   * @returns
   */
  const setValue = (value: string) => setState({
    ...state.current,
    value,
  });

  /**
   * Sets the 'approved' flag in the current state object.
   *
   * @param approved - The value to set for the 'approved' flag.
   */
  const setApproved = (approved: boolean) => setState({
    ...state.current,
    approved,
  });

  /**
   * Handles keydown events and performs certain actions based on the key pressed.
   *
   * @param key - The key pressed.
   */
  const handleKeydown = useActualCallback((key: string) => {
    if (state.current.approved) {
      return;
    }
    if (!enabled) {
      return;
    }
    if (key === 'Escape') {
      handleClose();
      return;
    }
    if (key === 'Backspace') {
      setValue(state.current.value.slice(0, Math.max(state.current.value.length - 1, 0)));
      if (!state.current.value.length) {
        handleClose();
      }
      return;
    }
    const digit = parseInt(key);
    if (!DIGIT_SET.has(digit)) {
      return;
    }
    if (!state.current.value) {
      setOpen(true);
    }
    setValue(`${state.current.value}${digit}`);
    if (state.current.value.length === digits) {
      setTimeout(() => {
        onCode && onCode(parseInt(state.current.value));
        handleClose();
      }, CODE_APPROVE_DELAY);
      setApproved(true);
    }
  });

  /**
   * Handles the dismissing of an event.
   *
   * This function is responsible for dismissing an event by closing it, unless
   * the event has already been approved.
   *
   * @function
   * @name handleDismiss
   * @returns
   *
   */
  const handleDismiss = () => {
    if (state.current.approved) {
      return;
    }
    handleClose();
  };

  useEffect(() => {
    const handler = (e: any) => {
      let isOk = false;
      isOk = isOk || e.target === document.body;
      isOk = isOk || (state.current.open && e.target.classList.contains(DIALOG_CONTAINER))
      if (!isOk) {
        return;
      }
      if (!enabled) {
        return;
      }
      handleKeydown(e.key);
    };
    document.body.addEventListener('keydown', handler);
    return () => document.body.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {children}
      <ModalDialog
        className={className}
        style={style}
        sx={sx}
        canCancel
        noSave
        open={state.current.open}
        onDismiss={handleDismiss}
        onClose={handleDismiss}
      >
        <DialogTitle>
          <Box mr={3}>
            {title}
          </Box>
        </DialogTitle>
        <Box
          p={3}
          sx={{
            width: "100%",
            minWidth: '225px',
            minHeight: '75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {!!state.current.value && (
            <Box>
              <Typography variant="h4">
                {state.current.value}
              </Typography>
              <Typography
                component="pre"
                variant="body2"
                sx={{ textAlign: 'center' }}
              >
                {description}
              </Typography>
            </Box>
          )}
        </Box>
      </ModalDialog>
    </>
  );
};

export default SecretView;
