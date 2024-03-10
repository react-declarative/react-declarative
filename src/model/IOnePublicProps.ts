import IAnything from "./IAnything";
import IField, { Value } from "./IField";

import IOneProps from "./IOneProps";

export interface IOnePublicProps<Data = IAnything, Payload = IAnything, Field = IField<Data>>
    extends Omit<IOneProps<Data, Payload, Field>, keyof {
        features: never;
    }> {
    onFocus?: IOneProps<Data, Payload, Field>['focus'];
    onBlur?: IOneProps<Data, Payload, Field>['blur'];
    onMenu?: IOneProps<Data, Payload, Field>['menu'];
    onReady?: IOneProps<Data, Payload, Field>['ready'];
    onChange?: IOneProps<Data, Payload, Field>['change'];
    onClick?: IOneProps<Data, Payload, Field>['click'];
    onInvalid?: IOneProps<Data, Payload, Field>['invalidity'];
    onLoadStart?: IOneProps<Data, Payload, Field>['loadStart'];
    onLoadEnd?: IOneProps<Data, Payload, Field>['loadEnd'];
    features?: Record<string, Value> | string[] | (() => (string[] | Record<string, Value>));
};

export default IOnePublicProps;
