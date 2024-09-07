/**
 * An array containing the names of various field types supported by the system.
 * @see {@link module:fields.custom-layout-field}
 * @see {@link module:fields.switch-field}
 * @see {@link module:fields.line-field}
 * @see {@link module:fields.file-field}
 * @see {@link module:fields.group-layout-field}
 * @see {@link module:fields.paper-layout-field}
 * @see {@link module:fields.outline-layout-field}
 * @see {@link module:fields.expansion-layout-field}
 * @see {@link module:fields.radio-field}
 * @see {@link module:fields.checkbox-field}
 * @see {@link module:fields.text-field}
 * @see {@link module:fields.date-field}
 * @see {@link module:fields.time-field}
 * @see {@link module:fields.progress-field}
 * @see {@link module:fields.component-field}
 * @see {@link module:fields.slider-field}
 * @see {@link module:fields.combo-field}
 * @see {@link module:fields.choose-field}
 * @see {@link module:fields.init-field}
 * @see {@link module:fields.complete-field}
 * @see {@link module:fields.items-field}
 * @see {@link module:fields.rating-field}
 * @see {@link module:fields.typography-field}
 * @see {@link module:fields.fragment-layout-field}
 * @see {@link module:fields.div-layout-field}
 * @see {@link module:fields.box-layout-field}
 * @see {@link module:fields.tabs-layout-field}
 * @see {@link module:fields.hero-layout-field}
 * @see {@link module:fields.center-layout-field}
 * @see {@link module:fields.stretch-layout-field}
 * @see {@link module:fields.condition-layout-field}
 */
const fieldsCache = [
    'custom-layout',
    'switch-field',
    'line-field',
    'file-field',
    'group-layout',
    'paper-layout',
    'outline-layout',
    'expansion-layout',
    'radio-field',
    'checkbox-field',
    'text-field',
    'date-field',
    'time-field',
    'progress-field',
    'component-field',
    'slider-field',
    'combo-field',
    'choose-field',
    'init-field',
    'complete-field',
    'items-field',
    'rating-field',
    'typography-field',
    'fragment-layout',
    'div-layout',
    'box-layout',
    'tabs-layout',
    'hero-layout',
    'center-layout',
    'stretch-layout',
    'condition-layout',
];

const fieldsMap = fieldsCache.reduce<Record<symbol, string>>((acm, cur) => ({ ...acm, [Symbol.for(cur)]: cur }), {});

// @ts-ignore
export const typeToString = (type: symbol | string) => fieldsMap[type] || type.toString();
