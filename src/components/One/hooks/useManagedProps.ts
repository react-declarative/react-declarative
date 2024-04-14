import { useEffect } from "react";

import useChangeSubject from "../../../hooks/useChangeSubject";
import useSingleton from "../../../hooks/useSingleton";
import useSubject from "../../../hooks/useSubject";

import IOnePublicProps from "../../../model/IOnePublicProps";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

const NEVER_VALUE = Symbol('never-value');

/**
 * Interface representing uncontrolled data configuration for components.
 * Uncontrolled components manage their own state internally without requiring external control.
 *
 * @template Data - The type of data being managed.
 */
interface IUncontrolledData<Data extends IAnything> {
    handler?: IOnePublicProps<Data>['handler'];
}

/**
 * Interface representing controlled data configuration for components.
 * Controlled components rely on external control to manage their state.
 *
 * @template Data - The type of data being managed.
 */
interface IControlledData<Data extends IAnything> {
    handler: Exclude<IOnePublicProps<Data>['handler'], undefined>;
    changeSubject: Exclude<IOnePublicProps<Data>['changeSubject'], undefined>;
}

/**
 * Type representing the managed props for components, which can be controlled or uncontrolled.
 * This type encapsulates both controlled and uncontrolled data configurations.
 *
 * @template Data - The type of data being managed.
 */
type IManagedProps<Data extends IAnything> = IControlledData<Data> | IUncontrolledData<Data>;

/**
 * Custom React hook to manage props based on controlled or uncontrolled behavior.
 * This hook facilitates handling controlled or uncontrolled mode of One component.
 *
 * @template Data - The type of data being managed.
 * @template Payload - The type of payload data, if applicable.
 * @template Field - The type of field template, if applicable.
 * @param props - The props object containing properties for the component.
 * @param [props.changeSubject] - The subject for propagating changes.
 * @param [props.handler] - The event handler function.
 * @param [props.data] - The initial data for the component.
 * @param otherProps - Additional props for the component.
 * @returns - An object containing managed props and additional properties.
 *                    The returned object may include the following properties:
 *                    - If uncontrolled: { handler, ...otherProps }
 *                    - If controlled: { changeSubject, handler, ...otherProps }
 */
export const useManagedProps = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data>>({
    changeSubject: upperChangeSubject,
    handler,
    data = NEVER_VALUE as unknown as Data,
    ...otherProps
}: IOnePublicProps<Data, Payload, Field>): IManagedProps<Data> & IOnePublicProps<Data, Payload, Field> => {

    const UNCONTROLLED_STATE = useSingleton(data === NEVER_VALUE);

    if (UNCONTROLLED_STATE) {
        return {
            handler,
            ...otherProps
        };
    }

    const propsChangeSubject = useSubject(upperChangeSubject);
    const dataChangeSubject = useChangeSubject(data);

    useEffect(() => propsChangeSubject.subscribe((data) => {
        dataChangeSubject.next(data);
    }), []);

    return {
        changeSubject: dataChangeSubject,
        handler: () => data,
        ...otherProps
    };
};

export default useManagedProps;
