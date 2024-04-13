import dayjs from "dayjs";

/**
 * @returns The initial moment stamp for London (UTC)
 */
export const getGenesisStamp = (stamp = dayjs(0)) => {
    return stamp.set('hour', 0);
};

export default getGenesisStamp;
