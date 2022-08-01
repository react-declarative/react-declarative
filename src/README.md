# Just for you known

> The `react-declarative` is not just a form builder. This one is a huge framework with [dashboard adaptive cards builder](./components/One/layouts/HeroLayout.tsx), crud-based [List component](./components/List) and more.

## Adding a new field type

Make changes by analogy sequentially in the following files

### Create a new field

0. **[model/IField.ts](./model/IField.ts)** - Add new field properties

1. **[config/createField.tsx](./components/One/config/createField.tsx)** - File registration (during execution)

2. **[config/initialValue.ts](./components/One/config/initialValue.ts)** - Default value for the field

3. **[config/isStatefull.ts](./components/One/config/isStatefull.ts)** - Mark If you're creating a field, not a layout

4. **[model/FieldType.ts](./model/FieldType.ts)** - Adding a field entry to enum

5. **[model/TypedField.ts](./model/TypedField.ts)** - Strong typing declaration for the userspace

### Register field slot

0. **[components/One/slots/CheckBoxSlot](./components/One/slots/CheckBoxSlot)** - Duplicate this folder and update naming

1. **[components/One/components/ISlotFactoryContext.ts](./components/One/components/SlotFactory/ISlotFactoryContext.ts)** - Update slot context interface

2. **[components/One/components/SlotFactory/SlotContext.ts](./components/One/components/SlotFactory/SlotContext.ts)** - Update slots context value

## Composition hierarchy

In order of composition during execution

0. **IField** - Field retrieved from the userspace

1. **IEntity** - A field connected to the instance of the `One` component

2. **IManaged** - A wrapper over the `change` callback and the current `object`, designed to prevent recursive repaints and provide a convenient api for a field developer

**IMPORTANT:** TypedField only checks at the time of static type checking. The internal implementation of the One component performs exactly the composition of objects without any typecheck