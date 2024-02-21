# The `IManaged` interface

> Link [to the source code](../../src/model/IManaged.ts)

During the execution the `<One />` component assign data and calbacks to the field interface in the following order:

1. **IField** - Field retrieved from the userspace

2. **IEntity** - A field connected to the instance of the `One` component

3. **IManaged** - A wrapper over the `change` callback and the current `object`, designed to prevent recursive repaints and provide a convenient api for a field developer

## Adding a new field type

Make changes following the analogy sequentially in the following files:

### Create a new field 

1. **[model/IField.ts](./model/IField.ts)**  - Add new field properties. 
2. **[config/createField.tsx](./components/One/config/createField.tsx)**  - Register the file (during execution). 
3. **[config/initialValue.ts](./components/One/config/initialValue.ts)**  - Set the default value for the field. 
4. **[config/isStatefull.ts](./components/One/config/isStatefull.ts)**  - Mark if you're creating a field, not a layout. 
5. **[model/FieldType.ts](./model/FieldType.ts)**  - Add a field entry to the enum. 
6. **[model/TypedField.ts](./model/TypedField.ts)**  - Declare strong typing for the user space.

### Register field slot 

1. **[components/One/slots/CheckBoxSlot](./components/One/slots/CheckBoxSlot)**  - Duplicate this folder and update naming. 
2. **[components/One/components/ISlotFactoryContext.ts](./components/One/components/SlotFactory/ISlotFactoryContext.ts)**   - Update the slot context interface. 
3. **[components/One/components/SlotFactory/SlotContext.ts](./components/One/components/SlotFactory/SlotContext.ts)**  - Update the slots context value.

**IMPORTANT:**  TypedField only checks at the time of static type checking. The internal implementation of the One component performs the composition of objects without any type check at runtime.
