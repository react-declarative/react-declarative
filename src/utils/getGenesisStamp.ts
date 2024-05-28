import dayjs from "dayjs";

import { removeUtcOffset } from "./addUtcOffset";

/**
 * Gets the initial moment stamp for London (UTC).
 * @param [stamp=dayjs(0)] - Optional. The timestamp to start from. Default is the Unix epoch.
 * @returns The dayjs moment stamp for London (UTC).
 */
export const getGenesisStamp = (stamp = dayjs(0)) => {
    return dayjs(removeUtcOffset(stamp));
};

export default getGenesisStamp;
