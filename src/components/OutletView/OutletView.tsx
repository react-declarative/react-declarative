import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { makeStyles } from "../../styles";

import { Reveal } from "../FetchView";

import useChangeSubject from "../../hooks/useChangeSubject";
import useRenderWaiter from "../../hooks/useRenderWaiter";
import useActualValue from "../../hooks/useActualValue";
import useSingleton from "../../hooks/useSingleton";
import useConfirm from "../../hooks/useConfirm";
import useSubject from "../../hooks/useSubject";

import IOutletViewProps from "./model/IOutletViewProps";
import IAnything from "../../model/IAnything";

import sleep from "../../utils/sleep";
import classNames from "../../utils/classNames";
import queued from "../../utils/hof/queued";

const LEAVE_MESSAGE = "The form contains unsaved changes. Continue?";

const WAIT_FOR_CHANGES_DELAY = 1_000;

const Fragment = () => <></>;

const useStyles = makeStyles()({
  root: {
    width: "100%",
  },
});

interface IState {
  component: React.ComponentType<any>;
  activeOption: string;
}

export const OutletView = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
>({
  className,
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  initialData = {} as Data,
  animation,
  routes,
  params = {} as Params,
  payload: upperPayload = {} as Payload,
  history,
  fallback,
  onChange,
  onSubmit,
  onLoadStart,
  onLoadEnd,
  changeSubject: upperChangeSubject,
  ...otherProps
}: IOutletViewProps<Data, Payload, Params>) => {
  const { classes } = useStyles();

  const changeSubject = useSubject(upperChangeSubject);

  const [data, setData] = useState(() => ({
    ...routes.reduce<Data>((acm, { id }) => ({ ...acm, [id]: null }), {} as Data),
    ...initialData,
  }));

  const [invalid, setInvalid] = useState(() => new Set<string>());
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(0);
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(
    () =>
      changeSubject.subscribe(([key, value]) => {
        setData((prevData) => ({
          ...prevData,
          [key]: value,
        }));
        setInvalid((prevInvalid) => {
          prevInvalid.delete(key);
          return new Set(prevInvalid);
        });
      }),
    []
  );

  const [state, setState] = useState<IState>(() => ({
    component: Fragment,
    activeOption: "",
  }));

  const { component, activeOption } = state;

  const [appear, setAppear] = useState(false);

  const payload = useSingleton(upperPayload);

  const pickConfirm = useConfirm({
    title: "Continue?",
    msg: LEAVE_MESSAGE,
  });

  const hasChanged = changed && !loading && !invalid.size;
  const hasInvalid = !!invalid.size;
  const hasLoading = !!loading;

  const hasChanged$ = useActualValue(hasChanged);
  const hasLoading$ = useActualValue(hasLoading);
  const hasInvalid$ = useActualValue(hasInvalid);
  const pathname$ = useActualValue(pathname);
  const data$ = useActualValue(data);

  const leaveSubject = useSubject<void>();
  const dataChangeSubject = useChangeSubject(data);

  useEffect(
    () => () => {
      leaveSubject.next();
    },
    []
  );

  useEffect(
    () =>
      dataChangeSubject.subscribe((data) => {
        const { current: changed } = hasChanged$;
        onChange && onChange(data, !changed);
      }),
    [onChange]
  );

  const handleLoadStart = () => {
    onLoadStart && onLoadStart();
    setLoading((loading) => loading + 1);
  };

  const handleLoadEnd = (isOk: boolean) => {
    onLoadEnd && onLoadEnd(isOk);
    setLoading((loading) => loading - 1);
  };

  const unsubscribeRef = useRef<Function | null>();

  const waitForElement = useRenderWaiter([component, activeOption], 50);
  const waitForRender = useRenderWaiter([data, changed], 500);
  const waitForLeave = () => leaveSubject.toPromise();

  const afterSave = async () => {
    unsubscribeRef.current && unsubscribeRef.current();
    setChanged(false);
    await Promise.race([waitForRender(), waitForLeave()]);
  };

  const waitForChanges = async () => {
    const unblock = history.block(() => {});
    handleLoadStart();
    try {
      await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
    } finally {
      handleLoadEnd(false);
      unblock();
    }
  };

  const beginSave = async () => {
    if (!hasChanged$.current) {
      return false;
    }
    if (hasLoading$.current) {
      return false;
    }
    if (hasInvalid$.current) {
      return false;
    }
    await waitForChanges();
    const unblock = history.block(() => {});
    const { current: data } = data$;
    if (data) {
      let isOk = true;
      handleLoadStart();
      try {
        let isSkipped = false;
        const result = await Promise.resolve(
          onSubmit(data, {
            async afterSave() {
              unblock();
              await afterSave();
              isSkipped = true;
            },
          })
        );
        if (result && !isSkipped) {
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
        unblock();
      }
      return isOk;
    } else {
      return false;
    }
  };

  useEffect(
    () =>
      history.listen(({ location }) => {
        setPathname(location.pathname);
      }),
    []
  );

  useEffect(() => {
    const waitForConfirm = () =>
      new Promise<boolean>((res) => {
        pickConfirm({
          msg: LEAVE_MESSAGE,
        }).then((isOk) => {
          res(isOk);
        });
      });

    const handleNavigate = async (retry: () => void) => {
      const isOk = await waitForConfirm();
      isOk && unsubscribe();
      isOk && retry();
    };

    const createRouterSubject = () =>
      history.block(({ retry, location }) => {
        if (routes.some(({ isActive }) => isActive(location.pathname))) {
          unsubscribeRef.current && unsubscribeRef.current();
          retry();
          return;
        }
        handleNavigate(retry);
      });

    const createUnloadSubject = () => {
      const handler = (e: any) => {
        e.preventDefault();
        return LEAVE_MESSAGE;
      };
      window.onbeforeunload = handler;
      return () => {
        window.onbeforeunload = null;
      };
    };

    let unsubscribeRouter: ReturnType<typeof createRouterSubject>;
    let unsubscribeUnload: ReturnType<typeof createUnloadSubject>;

    const unsubscribe = () => {
      unsubscribeRouter && unsubscribeRouter();
      unsubscribeUnload && unsubscribeUnload();
      unsubscribeRef.current = null;
    };

    const subscribe = () => {
      unsubscribeRouter = createRouterSubject();
      unsubscribeUnload = createUnloadSubject();
      unsubscribeRef.current = unsubscribe;
    };

    if (!!data && !!changed) {
      subscribe();
    }

    return unsubscribe;
  }, [data, changed, pathname]);

  const handleChange = (
    id: string,
    pendingData: Data[keyof Data],
    initial: boolean
  ) => {
    setInvalid((prevInvalid) => {
      prevInvalid.delete(id);
      return new Set(prevInvalid);
    });
    setData((prevData) => ({
      ...prevData,
      [id]: pendingData,
    }));
    if (!initial) {
      setChanged(true);
    }
  };

  const renderHandler = useMemo(
    () =>
      queued(async () => {
        const { current: pathname } = pathname$;
        setAppear(true);
        const target = routes.find(({ isActive }) => isActive(pathname));
        if (target) {
          const { id, element } = target;
          setState({
            component: element,
            activeOption: id,
          });
        } else {
          setState({
            component: Fragment,
            activeOption: "",
          });
        }
        await Promise.race([waitForElement(), sleep(500)]);
        setAppear(false);
      }),
    []
  );

  useEffect(() => {
    renderHandler();
  }, [pathname]);

  const formState = useMemo(
    () => ({
      data,
      hasChanged,
      hasLoading,
      hasInvalid,
      id: (params && params["id"]) || "create",
      change: (data: Data) => {
        setData((prevData) => ({
          ...prevData,
          ...data,
        }));
        setChanged(true);
      },
    }),
    [
      data,
      hasChanged,
      hasLoading,
      hasInvalid,
      (params && params["id"]) || "create",
    ]
  );

  return (
    <Reveal
      className={classNames(className, classes.root)}
      {...otherProps}
      animation={animation}
      appear={appear}
    >
      {React.createElement(component, {
        key: activeOption,
        dirty: hasInvalid || hasChanged,
        activeOption,
        readonly: hasChanged,
        hasChanged,
        hasLoading,
        hasInvalid,
        beginSave,
        afterSave,
        formState,
        data: data[activeOption] || null,
        params,
        onChange: (data: Data[keyof Data], initial = false) =>
          handleChange(activeOption, data, initial),
        onInvalid: () =>
          setInvalid((prevInvalid) => {
            prevInvalid.add(activeOption);
            return new Set(prevInvalid);
          }),
        payload,
      })}
    </Reveal>
  );
};

export default OutletView;
