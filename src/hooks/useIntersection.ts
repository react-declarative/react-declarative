import { useLayoutEffect, useRef, useState } from "react";

import debounce from "../utils/hof/debounce";

const INTERSECTION_DEBOUNCE = 1_000;

type Function = () => void;

const hasScrollbar = (element: HTMLElement) => {
    return element.scrollHeight > element.clientHeight;
};

const getFirstParentWithScrollbar = (element: HTMLElement): HTMLElement | null => {
    let currentElement: HTMLElement | null = element.parentElement;
    while (currentElement) {
      if (hasScrollbar(currentElement)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    return null;
};

function isElementInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top >= 0 && rect.bottom <= viewportHeight;
};

function isElementInScrollableContainer(element: HTMLElement, container: HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const adjustedElementTop = elementRect.top - containerRect.top + scrollTop;
    const adjustedElementBottom = adjustedElementTop + elementRect.height;
    const containerTop = scrollTop;
    const containerBottom = scrollTop + container.clientHeight;
    return (
        adjustedElementTop >= containerTop &&
        adjustedElementBottom <= containerBottom
    );
};

export const useIntersection = <T extends HTMLElement = HTMLElement>() => {
    const elementRef = useRef<T>();
    const [isVisible, setIsVisible] = useState(false);

    useLayoutEffect(() => {
        const { current: element } = elementRef;
        let disposeRef: Function;
        if (!element) {
            return;
        }
        const container = getFirstParentWithScrollbar(element);
        const getIntersectionVisibility = container
            ? () => isElementInScrollableContainer(element, container)
            : () => isElementInViewport(element);
        const handleIntersection = debounce(() => setIsVisible(getIntersectionVisibility), INTERSECTION_DEBOUNCE);
        setIsVisible(getIntersectionVisibility);
        if (container) {
            container.addEventListener('scroll', handleIntersection);
            window.addEventListener('resize', handleIntersection);
            disposeRef = () => {
                container.removeEventListener('scroll', handleIntersection);
                window.removeEventListener('resize', handleIntersection);
            };
        } else {
            document.documentElement.addEventListener('scroll', handleIntersection);
            window.addEventListener('resize', handleIntersection);
            disposeRef = () => {
                document.documentElement.removeEventListener('scroll', handleIntersection);
                window.removeEventListener('resize', handleIntersection);
            };
        }
        return () => {
            disposeRef && disposeRef();
        };
    }, []);

    return {
        elementRef,
        isVisible,
    };
};

export default useIntersection;
