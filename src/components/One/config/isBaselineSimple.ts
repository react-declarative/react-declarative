import IField from "../../../model/IField";

export const isBaselineSimple = ({ noBaseline }: IField) => {
    return !noBaseline;
};

export default isBaselineSimple;
