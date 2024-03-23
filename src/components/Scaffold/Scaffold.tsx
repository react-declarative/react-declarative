import * as React from 'react';
import { useMemo } from 'react';

import Async from '../Async';

import Content from './components/Content';
import LoaderDefault from './components/Loader';

import deepClone from '../../utils/deepClone';
import objects from '../../utils/objects';
import arrays from '../../utils/arrays';

import { LoaderProvider } from './hooks/useLoader';
import { LoaderLineProvider } from './hooks/useLoaderLine';
import { PassthroughProvider } from './hooks/usePassthrough';

import IScaffoldProps from './model/IScaffoldProps';
import IMenuGroup, { IMenuOption } from '../../model/IMenuGroup';

/**
 * Function that recursively flattens a nested array of objects.
 *
 * @template T - The type of the menu option.
 * @param arr - The array of menu groups.
 * @returns - The flattened array of menu options.
 */
const deepFlat = <T extends any = any>(arr: IMenuGroup<T>[] = []) => {
    const result: IMenuOption<T>[] = [];
    const process = (entries: any[] = []) => entries.forEach((entry) => {
        const options = entry['options'] || [];
        process([...options]);
        result.push(entry);
    });
    process(arr);
    return result;
};

const cloneDeep = (src: any) => arrays(deepClone(objects(src))); 

/**
 * Function that generates a Scaffold component.
 *
 * @param props - The props for the Scaffold component.
 * @param props.roles - The roles to resolve for the component.
 * @param props.payload - The payload for the component.
 * @param [props.throwError] - Whether to throw an error or not.
 * @param [props.fallback] - The fallback component to render while loading.
 * @param [props.options] - The options to resolve for the component.
 * @param [props.loadingLine=false] - Whether to show a loading line or not.
 * @param [props.loading=-1] - The payload for the loading line.
 * @param [props.Loader=LoaderDefault] - The component to use as the loader.
 * @param [props.withPassthrough=false] - Whether to pass the payload to child components or not.
 * @param [props.onInit] - The function to execute on component initialization.
 * @returns - The rendered component tree.
 */
export const Scaffold = <T extends any = any> ({
    roles,
    payload,
    throwError,
    fallback,
    options,
    loadingLine = false,
    loading = -1,
    Loader = LoaderDefault,
    withPassthrough = false,
    onInit = () => undefined,
    ...props
}: IScaffoldProps<T>) => {

    const resolveRoles = useMemo(() => async () => {
        if (typeof roles === 'function') {
            return await roles(payload!);
        } else {
            return roles;
        }
    }, [roles, payload]);

    const resolveOptions = useMemo(() => async () => {
        const result = cloneDeep(options);
        await Promise.all(deepFlat<T>(result).map(async (option: IMenuOption<T>) => {
            const {
                disabled = option.isDisabled,
                visible = option.isVisible,
                bold = option.isBold,
                roles = option.getRoles,
            } = option;
            if (typeof bold === 'function') {
                option.bold = await bold(payload!);
            }
            if (typeof visible === 'function') {
                option.visible = await visible(payload!);
            }
            if (typeof disabled === 'function') {
                option.disabled = await disabled(payload!);
            }
            if (typeof roles === 'function') {
                option.roles = await roles(payload!);
            }
        }));
        return result;
    }, [options, payload]);

    return (
        <LoaderProvider payload={loading}>
            <LoaderLineProvider payload={loadingLine}>
                <PassthroughProvider payload={withPassthrough}>
                    <Async
                        throwError={throwError}
                        fallback={fallback}
                        payload={payload}
                        Loader={Loader}
                    >
                        {async () => {
                            await onInit();
                            const roles = await resolveRoles();
                            const options = await resolveOptions();
                            return (
                                <Content<T>
                                    {...props}
                                    roles={roles}
                                    options={options}
                                    payload={payload}
                                />
                            );
                        }}
                    </Async>
                </PassthroughProvider>
            </LoaderLineProvider>
        </LoaderProvider>
    );
};

export default Scaffold;
