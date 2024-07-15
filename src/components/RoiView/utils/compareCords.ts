import ICord from "../model/ICord";

const compare = (obj1: ICord, obj2: ICord) => {
    let isEqual = true;
    isEqual = isEqual && obj1.type === obj2.type;
    isEqual = isEqual && obj1.color === obj2.color;
    isEqual = isEqual && obj1.id === obj2.id;
    isEqual = isEqual && obj1.top === obj2.top;
    isEqual = isEqual && obj1.left === obj2.left;
    isEqual = isEqual && obj1.width === obj2.width;
    isEqual = isEqual && obj1.height === obj2.height;
    return isEqual
}

export const compareCords = (arr1: ICord[], arr2: ICord[]) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const copyArr1 = [...arr1];
    const copyArr2 = [...arr2];

    const sortKey = (cord: ICord) => `${cord.type}-${cord.color}-${cord.id}`;
    copyArr1.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    copyArr2.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

    for (let i = 0; i < copyArr1.length; i++) {
        if (!compare(copyArr1[i], copyArr2[i])) {
            return false;
        }
    }

    return true;
}

export default compareCords;
