# Writing custom UIKit in parallel with development of the main product

> The point of `react-declarative` is to start the development process ASAP, polish the design later. Here's how to develop the main product and the UI kit in parallel

## Main concept

By default, when you coding with `react-declarative`, you will use MUI. It looks and feels native on each operation system: Windows, Linux, macOS, ChromeOS, even Tesla Car Firmware. But, after your coding startup started sales you will want to build custom UI to make customers be addicted to your platform. The problem is you don't know if there are going to be any customers. The main rule is [Move Fast or Die](https://news.ycombinator.com/item?id=32597811), you need minimal investments before first sales more than custom design.

## The Idea

There are two components which allow to customize `react-declarative`: [OneSlotFactory](../../src/components/One/components/SlotFactory/ISlotFactoryContext.ts) and [ListSlotFactory](../../src/components/List/components/SlotFactory/ISlotFactoryContext.ts). 

 - By using `<ListSlotFactory />` you can replace parts of the [`<List />` component](./datagrid-software-design.md) with JSX and state hooks. This is more like imperative functional way of development due to the grids should be extreamly performant and often highly customized by the business

 - By using `<OneSlotFactory />` you can replace each input field of every [`<One />` form](./code-sideeffect.md) with another component which render the view part. Just a UI, all state management keept [under the hood](../../src/components/One/components/makeField/makeField.tsx).

## So That's the thing

Split you frontend team into two parts. The first one start's the development by using default MUI. The second one uses [E2E integration tests](https://github.com/react-declarative/react-declarative-e2e/) to implement your own input fields, for example, in [Joy UI](https://mui.com/joy-ui/getting-started/). That set of unit tests will show you all bugs in you [UIKit](https://mui.com/store/). Even buy it if you want to

```tsx
import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

const fields: TypedField[] = [
    {
        type: FieldType.Text,
        title: 'Radio group 1 value',
        testId: 'compute-field',
        compute: (obj) => {
            if (obj.radio1 === 'first') {
                return 'It looks like radio #1 was cheched';
            } else if (obj.radio1 === 'second') {
                return 'It looks like radio #2 was cheched';
            } else if (obj.radio1 === 'third') {
                return 'It looks like radio #3 was cheched';
            } else {
                return 'Please mark radio button';
            }
        },
    },
    {
        type: FieldType.Outline,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Typography,
                placeholder: 'Radio Group 1'
            },
            {
                type: FieldType.Radio,
                testId: 'radio1-first',
                title: 'First radio button',
                name: 'radio1',
                radioValue: 'first',
            },
            {
                type: FieldType.Radio,
                testId: 'radio1-second',
                title: 'Second radio button',
                name: 'radio1',
                radioValue: 'second',
            },
            {
                type: FieldType.Radio,
                testId: 'radio1-third',
                title: 'Third radio button',
                name: 'radio1',
                radioValue: 'third',
            },
        ]
    },
    {
        type: FieldType.Outline,
        fields: [
            {
                type: FieldType.Typography,
                placeholder: 'Radio Group 2'
            },
            {
                type: FieldType.Radio,
                testId: 'radio2-first',
                title: 'First radio button',
                name: 'radio2',
                radioValue: 'first',
            },
            {
                type: FieldType.Radio,
                testId: 'radio2-second',
                title: 'Second radio button',
                name: 'radio2',
                radioValue: 'second',
            },
            {
                type: FieldType.Radio,
                testId: 'radio2-third',
                title: 'Third radio button',
                name: 'radio2',
                radioValue: 'third',
            },
        ]
    }
];

test("Will render nested schema", async ({ page }) => {
  const componentGroup = await renderFields(page, fields);
  await expect(componentGroup).toContainText('Radio Group 1');
  await expect(componentGroup).toContainText('Radio Group 2');
});

test("Will change compute on selection", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #1 was cheched')
});


test("Changing another radio group will not affect first one", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    await componentGroup.getByTestId('radio2-second').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #1 was cheched')
});

test("Changing another radio will affect text compute", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    await componentGroup.getByTestId('radio1-second').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #2 was cheched')
});

```


