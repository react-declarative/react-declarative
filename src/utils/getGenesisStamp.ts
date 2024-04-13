import dayjs from "dayjs";

/**
 * Gets the initial moment stamp for London (UTC).
 * @param [stamp=dayjs(0)] - Optional. The timestamp to start from. Default is the Unix epoch.
 * @returns The dayjs moment stamp for London (UTC).
 */
export const getGenesisStamp = (stamp = dayjs(0)) => {
    return stamp.set('hour', 0);
};

export default getGenesisStamp;
