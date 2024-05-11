import { createMemoryHistory } from "history";
import createSsManager from "./createSsManager";

interface IParams {
    allowed: (pathname: string) => boolean;
    map: (pathname: string) => string;
}

export const createManagedHistory = (storageKey: string, {
    allowed = () => true,
    map = (v) => v,
}: Partial<IParams> = {}) => {
    const storageManager = createSsManager<string>(storageKey);

    let pathname = storageManager.getValue();

    if (pathname) {
        pathname = allowed(pathname) ? pathname : null;
    }

    const history = createMemoryHistory(pathname ? {
        initialEntries: [
            {
                pathname,
            }
        ]
    } : undefined);

    history.listen(({
        location,
    }) => {
        if (allowed(location.pathname)) {
            const pathname = map(location.pathname);
            storageManager.setValue(pathname);
        }
    });

    return history;
};

export default createManagedHistory;
