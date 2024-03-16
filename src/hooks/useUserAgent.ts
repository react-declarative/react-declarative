import { useMemo } from "react";

/**
 * Returns an object that contains information about the user agent.
 * @returns - The user agent information.
 * @property isAppleMobile - Indicates whether the user agent is an Apple mobile device (iPad, iPhone, or iPod).
 */
export const useUserAgent = () => {
    return useMemo(() => {
        return {
            isAppleMobile: /iPad|iPhone|iPod/.test(window.navigator.userAgent),
        }
    }, []);
}

export default useUserAgent;
