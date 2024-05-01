import { createMemoryHistory } from "history";
import createSsManager from "./createSsManager";

interface IParams {
    allowed: (pathname: string) => boolean;
}

export const createManagedHistory = (storageKey: string, {
    allowed = () => true,
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
            storageManager.setValue(location.pathname);
        }
    });

    return history;
};

export default createManagedHistory;
