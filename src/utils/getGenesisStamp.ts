import dayjs from "dayjs";

import toUtcDate from "./toUtcDate";

/**
 * Gets the initial moment stamp for London (UTC).
 * @param [stamp=dayjs(0)] - Optional. The timestamp to start from. Default is the Unix epoch.
 * @returns The dayjs moment stamp for London (UTC).
 */
export const getGenesisStamp = (stamp = dayjs(0)) => {
    return dayjs(toUtcDate(stamp.toDate()));
};

export default getGenesisStamp;
