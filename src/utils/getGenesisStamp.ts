import dayjs from "dayjs";

import { fromMomentStamp } from "get-moment-stamp";

/**
 * Gets the initial moment stamp (the Unix epoch, UTC).
 *
 * @param [stamp=0] - Optional. The moment stamp to start from. Default is the Unix epoch.
 * @returns The dayjs object for the given moment stamp.
 */
export const getGenesisStamp = (stamp = 0) => {
    return dayjs(fromMomentStamp(stamp));
};

export default getGenesisStamp;
