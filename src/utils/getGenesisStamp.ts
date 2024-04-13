import dayjs from "dayjs";

/**
 * @returns The initial moment stamp for London (UTC)
 */
export const getGenesisStamp = () => {
    return dayjs(0).set('hour', 0);
};

export default getGenesisStamp;
