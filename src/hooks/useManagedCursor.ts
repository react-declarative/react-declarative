import { ChangeEvent, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import formatText from "../utils/formatText";
import normalizeText from "../utils/normalizeText";

import useActualValue from "./useActualValue";
import useChange from "./useChange";

import IField from "../model/IField";

const NEVER_POS = Symbol("never-pos");

const DEFAULT_TEMPLATE = "00000000000000000000000000000000000000000000000000";
const DEFAULT_SYMBOL = "0";

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
    return element.selectionStart || element.value.length;
};

interface IParams {
    inputFormatterSymbol?: IField['inputFormatterSymbol']
    inputFormatterAllowed?: IField['inputFormatterAllowed']
    inputFormatterReplace?: IField['inputFormatterReplace']
    inputFormatterTemplate?: IField['inputFormatterTemplate']
    inputFormatter?: IField['inputFormatter']
    value?: string;
    onChange?: (value: string) => void;
}

export const useManagedCursor = ({
    inputFormatterSymbol: symbol = DEFAULT_SYMBOL,
    inputFormatterAllowed: allowed,
    inputFormatterReplace: replace,
    inputFormatterTemplate: template = DEFAULT_TEMPLATE,
    inputFormatter = (raw) =>
        formatText(raw, template, {
            symbol,
            allowed,
            replace,
        }),
    value: upperValue = "",
    onChange,
}: IParams) => {

    const elementRef = useRef<HTMLInputElement>(null as never);

    const [value, setValue] = useState(upperValue);
    const value$ = useActualValue(value);

    useChange(() => {
        if (upperValue === value$.current) {
            return;
        }
        setValue(normalizeText(upperValue, {
            inputFormatter,
            inputFormatterSymbol: symbol,
            inputFormatterAllowed: allowed,
            inputFormatterReplace: replace,
            inputFormatterTemplate: template,
        }));
        elementRef.current?.setSelectionRange(null, null);
    }, [upperValue]);

    const caretManager = useMemo(() => {
        let lastPos: symbol | number = NEVER_POS;
        const getAdjust = (pos: number) => {
            let adjust = 0;
            for (let i = Math.max(pos - 1, 0); i < template.length; i++) {
                const char = template[i];
                if (char === symbol) {
                    break;
                }
                adjust += 1;
            }
            return adjust;
        };
        return {
            render: () => {
                const { current: input } = elementRef;
                if (input && input.type !== "text") {
                    return;
                }
                if (typeof lastPos === "number") {
                    input?.setSelectionRange(lastPos, lastPos);
                    lastPos = NEVER_POS;
                }
            },
            pos: () => {
                const { current: input } = elementRef;
                if (input) {
                    lastPos = getCaretPos(input);
                    lastPos += getAdjust(lastPos);
                }
                return lastPos;
            },
        };
    }, []);

    useLayoutEffect(() => {
        if (!template) {
            return;
        }
        const { current: input } = elementRef;
        const handler = () => caretManager.pos();
        input && input.addEventListener("keyup", handler);
        input && input.addEventListener("click", handler);
        return () => {
            input && input.removeEventListener("keyup", handler);
            input && input.removeEventListener("click", handler);
        };
    }, [elementRef.current]);

    useLayoutEffect(() => {
        if (template || replace || allowed) {
            caretManager.render();
        }
    }, [value]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let result = e.target.value;
        if (template || replace || allowed) {
            result = "";
            for (let i = 0; i < e.target.value.length; i++) {
                result += e.target.value[i];
                result = inputFormatter(result);
            }
            caretManager.pos();
        }
        setValue(result);
        onChange && onChange(result);
    }, []);

    return {
        inputRef: elementRef,
        inputValue: value,
        onInputChange: handleChange,
    };
};

export default useManagedCursor;
