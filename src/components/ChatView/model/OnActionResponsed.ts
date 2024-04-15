import ActionResponse from "./ActionResponse";

export interface OnActionResponsed {
    (response: ActionResponse): void;
}

export default OnActionResponsed;
