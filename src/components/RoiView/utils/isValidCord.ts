import { ICordInternal } from "../model/ICord";

declare function isNaN(value: any): boolean;

export const isValidCord = ({ top, left, height, width }: ICordInternal) => {
    if (isNaN(top)) {
        return false;
    }
    if (isNaN(left)) {
        return false;
    }
    if (isNaN(height)) {
        return false;
    }
    if (isNaN(width)) {
        return false;
    }
    return true;
}

export default isValidCord;
