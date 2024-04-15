import ActionResponse from "./ActionResponse";

export interface SelectActionResponse extends ActionResponse {
    type: 'select';
    option: {
        value: string;
        text: string;
    };
}

export default SelectActionResponse;
