import createValueProvider from "../../../utils/createValueProvider";

import ICalendarViewProps from "../model/ICalendarViewProps";

export const [PropsProvider, usePropsContext] = createValueProvider<ICalendarViewProps>();

export default usePropsContext;
