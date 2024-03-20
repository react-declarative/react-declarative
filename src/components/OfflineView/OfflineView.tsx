import * as React from "react";
import { useState, useEffect } from "react";

/**
 * Represents the props for the OfflineView component.
 */
interface IOfflineViewProps {
  children?: React.ReactNode;
  onOnline?: () => void;
  onOffline?: () => void;
  withPolling?: boolean;
  config?: IConfig;
  Offline?: React.ComponentType<any>;
}

/**
 * Represents a configuration for an API request.
 * @interface
 */
interface IConfig {
  url: string;
  method?: string;
  interval?: number;
  timeout?: number;
}

/**
 * Represents the interface for the state of a specific object.
 *
 * @interface IState
 */
interface IState {
  isOnline: boolean;
  initComplete: boolean;
}

const DEFAULT_TIMEOUT = 5_000;

const DEFAULT_METHOD = "GET";

const DEFAULT_CONFIG: IConfig = {
  url: "https://httpbin.org/get",
  method: DEFAULT_METHOD,
  timeout: DEFAULT_TIMEOUT,
  interval: DEFAULT_TIMEOUT,
};

const handlePing = async ({
  url,
  timeout = DEFAULT_TIMEOUT,
  method = DEFAULT_METHOD,
}: Omit<IConfig, 'interval'>) => {
  return new Promise((resolve) => {
    const isOnline = () => resolve(true);
    const isOffline = () => resolve(false);
    const xhr = new XMLHttpRequest();
    xhr.onerror = isOffline;
    xhr.ontimeout = isOffline;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        if (xhr.status) {
          isOnline();
        } else {
          isOffline();
        }
      }
    };
    xhr.open(method, url);
    xhr.timeout = timeout;
    xhr.send();
  });
};

const createConnectionManager = ({
  withPolling,
  config,
  onOnline,
  onOffline,
}: {
  withPolling?: boolean;
  config: IConfig;
  onOnline: () => void;
  onOffline: () => void;
}) => {
  if (withPolling) {
    const {
      interval = DEFAULT_TIMEOUT,
      timeout = DEFAULT_TIMEOUT,
      method = DEFAULT_METHOD,
      url,
    } = config;
    let pollingId: any = null;
    let isDisposed = false;
    const process = async () => {
      try {
        const isOnline = await handlePing({ url, timeout, method });
        if (isDisposed) {
          return;
        }
        isOnline ? onOnline() : onOffline();
      } catch {
        !isDisposed && onOffline();
      } finally {
        pollingId = setTimeout(process, interval)
      }
    };
    process();
    return () => {
      isDisposed = true;
      if (pollingId !== null) {
        clearInterval(pollingId);
      }
    };
  } else {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }
};

export const OfflineView = ({
  children,
  onOnline,
  onOffline,
  config = DEFAULT_CONFIG,
  withPolling = false,
  Offline,
}: IOfflineViewProps) => {
  const [state, setState] = useState<IState>({
    isOnline: false,
    initComplete: false,
  });

  const setIsOnline = (isOnline: boolean) =>
    setState((prevState) => ({ ...prevState, isOnline }));

  useEffect(() => {
    setState(() => ({
      isOnline: typeof navigator.onLine === "boolean" ? navigator.onLine : true,
      initComplete: true,
    }));
    return createConnectionManager({
      onOnline: () => {
        setIsOnline(true);
        onOnline && onOnline();
      },
      onOffline: () => {
        setIsOnline(false);
        onOffline && onOffline();
      },
      config,
      withPolling,
    });
  }, []);

  if (state.initComplete) {
    if (Offline) {
      if (state.isOnline) {
        return (
          <>
            {children}
          </>
        );
      } else {
        return <Offline />;
      }
    } else {
      return (
        <>
          {children}
        </>
      );
    }
  } else {
    return null;
  }
};

export default OfflineView;
