import ActionRequest from "./ActionRequest";
import SelectActionResponse from "./SelectActionResponse";

export interface SelectActionRequest extends ActionRequest {
    type: 'select';
    options: {
        value: string;
        text: string;
    }[];
    response?: SelectActionResponse;
}

export default SelectActionRequest;
