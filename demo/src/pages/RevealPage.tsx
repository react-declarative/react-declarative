import { FetchView } from "react-declarative";
import sleep from "../utils/sleep";

export const RevealPage = () => {

    const state = [
        () => sleep(1_000).then(() => 1),
        () => sleep(3_000).then(() => 3),
        () => sleep(2_000).then(() => 2),
        /*() => Promise.reject('error'),*/
    ];

    return (
        <FetchView state={state}>
            {(data: any) => (
                <span style={{ color: 'green' }}>
                    {JSON.stringify(data)}
                </span>
            )}
        </FetchView>
    );
}

export default RevealPage;
