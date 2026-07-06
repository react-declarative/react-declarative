import { singleshot } from "functools-kit";

export interface IClearable {
    clear: () => void;
}

export { singleshot };

export default singleshot;
