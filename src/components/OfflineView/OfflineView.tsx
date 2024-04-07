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

/**
 * Default configuration for the software.
 * @typedef {Object} IConfig
 * @property url - The URL to be used for the request.
 * @property method - The HTTP method to be used for the request.
 * @property timeout - The timeout value in milliseconds for the request.
 * @property interval - The interval value in milliseconds for the request.
 */
const DEFAULT_CONFIG: IConfig = {
  url: "https://httpbin.org/get",
  method: DEFAULT_METHOD,
  timeout: DEFAULT_TIMEOUT,
  interval: DEFAULT_TIMEOUT,
};

/**
 * Handles a ping request to a specified URL.
 * @param config - Ping configuration object.
 * @param config.url - The URL to ping.
 * @param [config.timeout=3000] - The timeout value in milliseconds.
 * @param [config.method='GET'] - The HTTP request method.
 * @returns - A promise that resolves to true if the ping is successful, or false if it fails.
 */
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

/**
 * Initialize a connection manager that handles online and offline events,
 * with an optional polling mechanism for checking the connection status.
 *
 * @param options - The options for the connection manager.
 * @param [options.withPolling] - Whether to use polling mechanism.
 * @param options.config - The configuration for the connection manager.
 * @param options.onOnline - The callback function to be executed when the connection is online.
 * @param options.onOffline - The callback function to be executed when the connection is offline.
 * @returns - The cleanup function to remove event listeners or stop polling.
 */
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
    /**
     * Asynchronous function that handles the process flow.
     * It checks if the system is online by pinging a specified URL with a certain timeout and method.
     * It then calls the appropriate callback functions based on the status of the system.
     * If an error occurs during the process, it also calls the `onOffline` callback.
     * Finally, it sets a timeout to run the process again after a specified interval.
     */
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

/**
 * Represents a component that renders its child components conditionally based on the online status of the browser.
 *
 * @param OfflineViewProps - The configuration options for the OfflineView component.
 * @param children - The child components to be rendered when the browser is online.
 * @param onOnline - Callback function to be called when the browser transitions to the online state. (optional)
 * @param onOffline - Callback function to be called when the browser transitions to the offline state. (optional)
 * @param config - Configuration options for the OfflineView component. (optional, default: DEFAULT_CONFIG)
 * @param withPolling - Whether to enable polling for checking online status. (optional, default: false)
 * @param Offline - The component to be rendered when the browser is offline. (optional)
 * @returns The rendered child components or null if the initialization is not yet complete.
 */
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
