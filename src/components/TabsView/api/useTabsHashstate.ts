import { useState, useMemo } from 'react';

import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

import { ITabsViewProps } from '../TabsView';

import createWindowHistory from '../../../utils/createWindowHistory';

interface IResult<T extends any = string> {
    tabsProps: {
        value: ITabsViewProps<T>['value'];
        onChange: ITabsViewProps<T>['onChange'];
    },
    hashManager: {
        getValue: () => string;
        setValue: (hash: string) => void;
    };
}

interface IParams {
    history?: MemoryHistory | BrowserHistory | HashHistory;
    defaultValue?: string;
}

const DEFAULT_HISTORY = createWindowHistory();

export const useTabsHashstate = <T extends any = string>({
    history = DEFAULT_HISTORY,
    defaultValue = "",
}: IParams = {}): IResult<T> => {

    const hashManager = useMemo(() => new class {

        getValue = () => {
            const { hash } = history.location;
            return hash[0] === '#' ? hash.slice(1, hash.length) : hash;
        };
    
        setValue = (hash: string) => {
            const { pathname, search } = history.location;
            history.push({
                pathname,
                search,
                hash,
            });
        };
    
    }, [history]);

    const [value, setValue] = useState(hashManager.getValue() || defaultValue);

    const onChange = (value: string) => {
        hashManager.setValue(value);
        setValue(value)
    };

    return {
        tabsProps: {
            value,
            onChange,
        },
        hashManager,
    };
};

export default useTabsHashstate;
