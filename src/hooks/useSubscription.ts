import { useEffect } from "react";

import { TSubject } from "../utils/rx/Subject";
import TObserver from "../model/TObserver";

export const useSubscription = <Data = any>(target: TSubject<Data> | TObserver<Data>, callbackfn: (data: Data) => void, ...deps: any[]) => {
    useEffect(() => {
        let dtor: any = undefined;
        if ('subscribe' in target) {
            dtor = target.subscribe(callbackfn);
        }
        if ('connect' in target) {
            dtor = target.connect(callbackfn);
        }
        return dtor;
    }, [target, ...deps]);
};

export default useSubscription;
