import ActionResponse from "./ActionResponse";

export interface MultiSelectActionResponse extends ActionResponse {
    type: 'multi-select';
    options: {
        value: string;
        text: string;
    }[];
}

export default MultiSelectActionResponse;
