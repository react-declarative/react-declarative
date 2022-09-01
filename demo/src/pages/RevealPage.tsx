import React from 'react';

import { FetchView } from "react-declarative";
import sleep from "../utils/sleep";

export const RevealPage = () => {

    const state = () => [
        sleep(1_000).then(() => 'string'),
        sleep(3_000).then(() => 1),
        sleep(2_000).then(() => false),
        // Promise.reject('error'),
    ] as const;

    return (
        <FetchView state={state}>
            {(str, num, bool) => (
                <span style={{ color: 'green' }}>
                    {JSON.stringify({
                        str,
                        num,
                        bool,
                    }, null, 2)}
                </span>
            )}
        </FetchView>
    );
}

export default RevealPage;
