import { useState, useRef, useEffect, useLayoutEffect } from "react";

import { BrowserHistory, MemoryHistory, HashHistory } from "history";

import createWindowHistory from "../../../utils/createWindowHistory";
import sleep from "../../../utils/sleep";

import useConfirm from "../../../hooks/useConfirm";
import useRenderWaiter from "../../../hooks/useRenderWaiter";
import useSubject from "../../../hooks/useSubject";

import useActualCallback from "../../../hooks/useActualCallback";
import useActualValue from "../../../hooks/useActualValue";

import IOneProps from "../../../model/IOneProps";
import IAnything from "../../../model/IAnything";
import type TSubject from "../../../model/TSubject";
import IOneApi from "../../../model/IOneApi";

/**
 * Interface for the parameters of the IPreventLeaveParams class.
 * @template Data - The type of data.
 * @template ID - The type of ID.
 */
export interface IPreventLeaveParams<Data = IAnything, ID = string> {
  history?: BrowserHistory | MemoryHistory | HashHistory;
  waitForChangesDelay?: number;
  readonly?: boolean;
  data?: Data | null;
  updateSubject?: TSubject<[ID, Data]>;
  changeSubject?: TSubject<Data>;
  shouldAutoSave?: () => boolean;
  checkUpdate?: (id: ID, data: Data) => boolean;
  checkDirty?: (prevData: Data, currentData: Data) => boolean;
  onChange?: IOneProps<Data>["change"];
  onBlock?: () => (() => void) | void;
  onUpdate?: (id: ID, data: Data) => void;
  onSave?: (data: Data) => boolean | Promise<boolean>;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
}

/**
 * Interface for a class that prevents leaving and returning to a page or component.
 *
 * @template Data - The type of the data.
 */
export interface IPreventLeaveReturn<Data = IAnything> {
  oneProps: {
    apiRef: Exclude<IOneProps<Data>["apiRef"], undefined>;
    handler: () => Data | null;
    change: (data: Data, initial?: boolean) => void;
    invalidity: Exclude<IOneProps<Data>["invalidity"], undefined>;
    readonly: Exclude<IOneProps<Data>["readonly"], undefined>;
    changeSubject: Exclude<IOneProps<Data>["changeSubject"], undefined>;
    fallback?: (e: Error) => void;
  };
  apiRef: React.MutableRefObject<IOneApi<Data>>;
  invalid: boolean;
  data: Data | null;
  hasChanged: boolean;
  hasLoading: boolean;
  beginSave: () => Promise<boolean>;
  afterSave: () => void;
  dropChanges: () => void;
  waitForChanges: () => Promise<Data | null>;
}

const LEAVE_MESSAGE = "The form contains unsaved changes. Continue?";
const INVALID_MESSAGE = "The form contains invalid data. Continue?";
const DEFAULT_HISTORY = createWindowHistory();
const WAIT_FOR_CHANGES_DELAY = 1_000;

/**
 * PreventLeave hook documentation
 *
 * @template Data - The data type
 * @template ID - The ID type
 *
 * @param [params] - The optional parameters
 * @param [params.history] - The history object to use for navigation
 * @param [params.waitForChangesDelay] - The delay in milliseconds to wait for changes
 * @param [params.readonly] - Whether the data is readonly
 * @param [params.onChange] - The callback function to execute when the data changes
 * @param [params.onLoadStart] - The callback function to execute when loading starts
 * @param [params.onLoadEnd] - The callback function to execute when loading ends
 * @param [params.onBlock] - The callback function to execute to block navigation
 * @param [params.onSave] - The callback function to execute when saving the data
 * @param [params.onUpdate] - The callback function to execute when updating the data
 * @param [params.checkUpdate] - The function to check if an update is allowed
 * @param [params.checkDirty] - The function to check if the data is dirty
 * @param [params.shouldAutoSave] - The function to determine if autosave should be enabled
 * @param [params.fallback] - The fallback object to handle errors
 * @param [params.updateSubject] - The subject to subscribe to for updates
 * @param [params.changeSubject] - The subject to subscribe to for changes
 *
 * @returns - The PreventLeave hook return object
 * @returns return.beginSave - The function to begin the save process
 * @returns return.afterSave - The function to execute after saving
 * @returns return.dropChanges - The function to drop changes and reset to initial data
 * @returns return.waitForChanges - The function to wait for changes to settle
 * @returns return.oneProps - The one props object for OneForm integration
 * @returns return.oneProps.change - The function to change the data
 * @returns return.oneProps.invalidity - The function to set the data as invalid
 * @returns return.oneProps.readonly - Whether the data is readonly
 * @returns return.data - The data object, null if invalid
 * @returns return.hasChanged - Whether the data has changed
 * @returns return.hasLoading - Whether the data is being loaded
 */
export const usePreventLeave = <Data = IAnything, ID = string>({
  history = DEFAULT_HISTORY,
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  readonly: upperReadonly = false,
  data: upperData = null,
  onChange,
  onLoadStart,
  onLoadEnd,
  onBlock = () => () => null,
  onSave = () => true,
  onUpdate = () => null,
  checkUpdate = () => true,
  checkDirty = () => true,
  shouldAutoSave = () => false,
  fallback,
  updateSubject: upperUpdateSubject,
  changeSubject: upperChangeSubject,
}: IPreventLeaveParams<Data, ID> = {}): IPreventLeaveReturn<Data> => {

  const apiRef = useRef<IOneApi>(null as never);

  const updateSubject = useSubject(upperUpdateSubject);

  const changeSubject = useSubject<Data>(upperChangeSubject);

  const [data, setData] = useState<Data | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(0);
  const [readonly, setReadonly] = useState(false);

  const initialDataRef = useRef<Data | null>(data);

  const hasChanged = !!data && !loading;
  const hasLoading = !!loading;

  const onUpdate$ = useActualCallback(onUpdate);

  const hasChanged$ = useActualValue(hasChanged);
  const hasLoading$ = useActualValue(hasLoading);
  const data$ = useActualValue(data);

  useEffect(
    () =>
      updateSubject.subscribe(([id, change]) => {
        if (hasLoading$.current) {
          return;
        }
        if (!checkUpdate(id, change)) {
          return;
        }
        changeSubject.next(change);
        if (hasChanged$.current) {
          setData(change);
        }
        onUpdate$(id, change);
      }),
    []
  );

  /**
   * Handles the load start event.
   * It calls the `onLoadStart` function if it exists,
   * and updates the loading state by incrementing it by 1.
   *
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => {
    onLoadStart && onLoadStart();
    setLoading((loading) => loading + 1);
  };

  /**
   * Handles the completion of a load operation.
   * @param isOk - Indicates whether the load operation was successful or not.
   */
  const handleLoadEnd = (isOk: boolean) => {
    onLoadEnd && onLoadEnd(isOk);
    setLoading((loading) => loading - 1);
  };

  const leaveSubject = useSubject<void>();

  useEffect(
    () => () => {
      leaveSubject.next();
    },
    []
  );

  const unsubscribeRef = useRef<Function | null>();

  const waitForRender = useRenderWaiter([data, invalid], 10);

  const waitForLeave = () => leaveSubject.toPromise();

  /**
   * Represents a confirmation dialog box for picking an option.
   *
   * @param options - The configuration options for the confirmation dialog box.
   * @param options.title - The title of the confirmation dialog box.
   * @param options.msg - The message displayed in the confirmation dialog box.
   *
   * @returns - Indicates whether the user confirmed the action or not.
   */
  const pickConfirm = useConfirm({
    title: "Continue?",
    msg: LEAVE_MESSAGE,
  });

  const isMounted = useRef(true);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const confirmSubject = useSubject<boolean>();
  const confirmRef = useRef<boolean>(false);

  useEffect(() => {
    const waitForConfirm = () => {
      if (confirmRef.current) {
        return confirmSubject.toPromise();
      }
      return new Promise<boolean>((res) => {
        confirmRef.current = true;
        pickConfirm({
          msg: invalid ? INVALID_MESSAGE : LEAVE_MESSAGE,
        }).then((isOk) => {
          confirmRef.current = false;
          confirmSubject.next(isOk);
          res(isOk);
        });
      });
    };

    /**
     * Handle navigation logic that includes auto-save and confirmation.
     * @param retry - Function to retry navigation.
     * @returns
     */
    const handleNavigate = async (retry: () => void) => {
      let isOk = false;
      if (shouldAutoSave()) {
        isOk = isOk || (await beginSave());
      }
      if (!isOk) {
        isOk = isOk || (await waitForConfirm());
      }
      isOk && unsubscribe();
      isOk && retry();
    };

    /**
     * Creates a router subject that handles navigation changes.
     *
     * @returns A function that can be called to navigate and handle navigation changes.
     */
    const createRouterSubject = () =>
      history.block(({ retry }) => handleNavigate(retry));

    /**
     * Creates a layout subject.
     *
     * @returns A function that, when invoked, disposes of the layout subject.
     */
    const createLayoutSubject = () => {
      const dispose = onBlock && onBlock();
      return () => dispose && dispose();
    };

    /**
     * Creates an unload subject that listens to the 'beforeunload' event and returns a function to remove the event listener.
     *
     * @returns A function that removes the 'beforeunload' event listener.
     */
    const createUnloadSubject = () => {
      const handler = (e: any) => {
        e.preventDefault();
        return LEAVE_MESSAGE;
      };
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    };

    let unsubscribeRouter: ReturnType<typeof createRouterSubject>;
    let unsubscribeLayout: ReturnType<typeof createLayoutSubject>;
    let unsubscribeUnload: ReturnType<typeof createUnloadSubject>;

    /**
     * Unsubscribes the router, layout, and unload events.
     * Resets the ref to null.
     *
     * @function unsubscribe
     * @memberof module:example-module
     * @returns
     */
    const unsubscribe = () => {
      unsubscribeRouter && unsubscribeRouter();
      unsubscribeLayout && unsubscribeLayout();
      unsubscribeUnload && unsubscribeUnload();
      unsubscribeRef.current = null;
    };

    /**
     * Sets up subscriptions to various subjects.
     * @returns
     */
    const subscribe = () => {
      unsubscribeRouter = createRouterSubject();
      unsubscribeLayout = createLayoutSubject();
      unsubscribeUnload = createUnloadSubject();
      unsubscribeRef.current = unsubscribe;
    };

    if (!!data || invalid) {
      subscribe();
    }

    return unsubscribe;
  }, [data, invalid]);

  /**
   * Handles the change of data.
   *
   * @param pendingData - The new data to be checked against the current data.
   * @param initial - Flag indicating if the change is the initial change.
   */
  const handleChange = (pendingData: Data, initial = false) => {
    const { current: data } = data$;
    const isDirty = checkDirty(data || ({} as Data), pendingData);
    if (!isDirty) {
      return;
    }
    if (!initial) {
      isMounted.current && setData(pendingData);
      isMounted.current && setInvalid(false);
    }
    if (initial) {
      initialDataRef.current = pendingData;
    }
    onChange && onChange(pendingData, initial);
  };

  /**
   * Handles the invalid state by setting it to true.
   *
   * @function handleInvalid
   * @returns
   */
  const handleInvalid = () => {
    setInvalid(true);
  };

  /**
   * The afterSave function is an asynchronous function that is called after a save operation.
   * It performs the following tasks:
   * - Unsubscribes from any existing subscription if it exists.
   * - Clears the data state by setting it to null.
   * - Resets the invalid state to false.
   * - Waits for either the render or leave events to occur using Promise.race.
   *
   * @async
   * @function afterSave
   * @returns A Promise that resolves when the afterSave tasks are completed.
   */
  const afterSave = async () => {
    unsubscribeRef.current && unsubscribeRef.current();
    if (isMounted.current) {
      setData(null);
      setInvalid(false);
      await Promise.race([waitForRender(), waitForLeave()]);
    }
  };

  /**
   * Begins the saving process.
   * If there are no changes, it returns false.
   * If there is a pending loading, it returns false.
   * If there are changes, it waits for changes to be applied and retrieves the current data.
   * It then calls the onSave function with the data and handles the result accordingly.
   * After the save is completed, it calls the afterSave function.
   * If there is an error during the save process, it handles the error and optionally calls fallback function.
   * Finally, it handles the loading state based on the success of the save and returns the result.
   * @returns - Returns a promise with a boolean value indicating the success of the save.
   */
  const beginSave = async () => {
    if (!hasChanged$.current) {
      return false;
    }
    if (hasLoading$.current) {
      return false;
    }
    await waitForChanges();
    const { current: data } = data$;
    if (data) {
      let isOk = true;
      handleLoadStart();
      try {
        const result = await Promise.resolve(onSave(data));
        if (result) {
          await afterSave();
        }
        isOk = !!result;
      } catch (e) {
        isOk = false;
        unsubscribeRef.current && unsubscribeRef.current();
        if (fallback) {
          fallback(e as Error);
        } else {
          throw e;
        }
      } finally {
        handleLoadEnd(isOk);
      }
      return isOk;
    } else {
      return false;
    }
  };

  /**
   * Drops changes made to the data.
   *
   * @function dropChanges
   * @description This function drops the changes made to the data. It sets the last data value obtained from the initial data reference as the next value emitted by the change subject
   *. It sets the data to null and invalid state to false.
   */
  const dropChanges = () => {
    const { current: lastData } = initialDataRef;
    lastData && changeSubject.next(lastData);
    setData(null);
    setInvalid(false);
  };

  /**
   * Asynchronously waits for changes to occur.
   *
   * @async
   * @function waitForChanges
   * @returns A promise that resolves when changes have occurred.
   */
  const waitForChanges = async () => {
    const unblock = history.block(() => {});
    setReadonly(true);
    try {
      await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
    } finally {
      setReadonly(false);
      unblock();
    }
    return data$.current;
  };

  return {
    beginSave,
    afterSave,
    dropChanges,
    waitForChanges,
    oneProps: {
      apiRef,
      handler: () => upperData,
      change: handleChange,
      invalidity: handleInvalid,
      readonly: !!loading || readonly || upperReadonly,
      ...(fallback && { fallback }),
      changeSubject,
    },
    apiRef,
    invalid,
    data: invalid ? null : data,
    hasChanged,
    hasLoading,
  } as const;
};

export default usePreventLeave;
