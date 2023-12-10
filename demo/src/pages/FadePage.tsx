import React, { useState } from "react";

import { Grid, Button, Paper } from "@mui/material";
import { useEffect } from "react";
import {
  InfiniteView,
  VirtualView,
  Grid as RdGrid,
  IGridColumn,
  IGridAction,
  FadeView,
  TabsView,
  ScaleView,
  Copy,
  ITab,
  useTabsHashstate,
  RecordView,
  ActionButton,
  ActionIcon,
  ActionFab,
  ActionFilter,
  ActionTrigger,
  ActionStopIcon,
  MasterDetailMode,
  ActionToggle,
  IActionFilter,
  IActionTrigger,
  useSnack,
  usePrompt,
  useActionModal,
  FieldType,
  useMediaContext,
  Search,
  Spinner,
  Countdown,
  CardView,
  FeatureView,
  IFeatureGroup,
  DocumentView,
  ImageView,
  FilesView,
  IOption,
  MasterDetail,
  IMasterDetailOption,
  ColorButton,
} from "react-declarative";

import { v4 as uuid } from "uuid";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import history from "../history";

import sleep from "../utils/sleep";

import mock from "./mock/list";

const options: IOption[] = [
  {
    label: 'Test',
    action: 'test',
  },
];

const items: IMasterDetailOption[] = [
  {
    id: 'test1',
    icon: AddIcon,
  },
  {
    id: 'test2',
    icon: DeleteIcon,
  },
];

const features: IFeatureGroup[] = [
  {
    title: 'Moderations',
    expanded: true,
    children: [
      {
        name: 'moderations1',
        label: 'Moderations',
        description: 'Toggle moderation notifications',
      },
      {
        name: 'moderations2',
        label: 'Moderations',
        description: 'Toggle moderation notifications',
      },
      {
        name: 'moderations3',
        label: 'Moderations',
        description: 'Toggle moderation notifications',
      },
    ],
  },
  {
    title: 'Payments',
    expanded: true,
    children: [
      {
        name: 'payments1',
        label: 'Payments',
        description: 'Toggle payments notifications',
      },
      {
        name: 'payments2',
        label: 'Payments',
        description: 'Toggle payments notifications',
      },
    ],
  },
  {
    title: 'Withdraws',
    expanded: true,
    children: [
      {
        name: 'withdraws1',
        label: 'Withdraws',
        description: 'Toggle withdraw notifications',
      },
    ],
  },
];

const columns: IGridColumn<typeof mock[0]>[] = [
  {
    field: "id",
    label: "Id",
    format: ({ id }) => <Copy content={id} />,
  },
  {
    field: "firstName",
    label: "First Name",
  },
  {
    field: "lastName",
    label: "Last Name",
  },
  {
    field: "content",
    label: "Comment",
  },
  {
    field: "age",
    align: "center",
    label: "Age",
  },
];

const actions: IGridAction[] = [
  {
    action: "test-action",
    label: "Test action",
  },
];

const recordData = {
  foo: "bar",
  bar: {
    baz: "foo",
    omg: "test",
    fff: "ttt",
    brrr: {
      bzzz: "ffff",
    },
  },
  baz: {
    baz: "foo",
    omg: "test",
  },
  test: "omg",
};

const tabs: ITab[] = [
  {
    label: "tab1",
    value: "tab1",
    isDisabled: async () => {
      await sleep(3_000);
      return true;
    },
  },
  {
    label: "tab2",
    value: "tab2",
  },
  {
    label: "tab3",
    value: "tab3",
  },
];

const actions_filter: IActionFilter[] = [
  {
    action: "first-filter",
    label: "First filter",
    items: [
      {
        label: "First item",
        value: "first-item",
      },
      {
        label: "Second item",
        value: "second-item",
      },
      {
        label: "Third item",
        value: "third-item",
      },
    ],
  },
  {
    action: "second-filter",
    label: "Second filter",
    items: [
      {
        label: "First item",
        value: "first-item",
      },
      {
        label: "Second item",
        value: "second-item",
      },
      {
        label: "Third item",
        value: "third-item",
      },
    ],
  },
  {
    action: "third-filter",
    label: "Third filter",
    items: [
      {
        label: "First item",
        value: "first-item",
      },
      {
        label: "Second item",
        value: "second-item",
      },
      {
        label: "Third item",
        value: "third-item",
      },
    ],
  },
];

const actions_trigger: IActionTrigger[] = [
  {
    action: "first-action",
    label: "First action",
    isAvailable: async () => {
      await sleep(3_000);
      return true;
    },
  },
  {
    action: "second-action",
    label: "Second action",
    isAvailable: async () => {
      await sleep(3_000);
      return false;
    },
  },
  {
    action: "third-action",
    label: "Third action",
    isAvailable: async () => {
      await sleep(3_000);
      return true;
    },
  },
];

export const FadePage = () => {
  const [items1, setItems1] = useState(() => [
    uuid(),
    uuid(),
    uuid(),
    uuid(),
    uuid(),
  ]);

  const [items2, setItems2] = useState(() => [
    uuid(),
    uuid(),
    uuid(),
    uuid(),
    uuid(),
  ]);

  const [value, setValue] = useState<any>(null);
  const [color, setColor] = useState("");

  const { isPhone, isTablet, isDesktop } = useMediaContext();

  const { pickData, render } = useActionModal({
    fields: [
      {
        type: FieldType.Text,
        name: "text",
        title: "Text field",
      },
    ],
    title: "Example modal",
    onSubmit: async (data) => {
      console.log({ data });
      notify("click");
      await sleep(3_000);
      return true;
    },
  });

  const { tabsProps } = useTabsHashstate({
    history,
  });

  const notify = useSnack();

  const pickPrompt = usePrompt();

  useEffect(() => {
    console.log("ctor");
    return () => {
      console.log("dtor");
    };
  }, []);

  const handleClick = async (data: any) => {
    await sleep(3_000);
    console.log({ data });
    notify("click");
  };

  const handlePrompt = () => {
    pickPrompt().then(console.log);
  };

  const handleModal = () => {
    pickData();
  };

  return (
    <>
      <Grid item xs={12}>
        <FadeView
          disableRight
          style={{
            height: 100,
            width: "calc(100% - 50px)",
          }}
        >
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </FadeView>
      </Grid>
      <Grid item xs={12}>
        <FadeView
          disableBottom
          style={{
            height: 50,
            width: "calc(100% - 50px)",
          }}
        >
          <p style={{ whiteSpace: "nowrap" }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </FadeView>
      </Grid>
      <TabsView items={tabs} {...tabsProps}>
        {(value) => {
          return () => <p>{value}</p>;
        }}
      </TabsView>
      <ScaleView
        style={{ width: "100%", height: 300, background: "magenta" }}
        center
      >
        <div
          style={{
            height: 200,
            width: 300,
            background: "cyan",
          }}
        />
      </ScaleView>
      <Search
        handler={async (search: string, skip: number) => {
          console.log({ search, skip });
          await sleep(3_000);
          return new Array(10).fill(0).map(() => {
            const item = uuid();
            return {
              label: item,
              value: item,
            };
          });
        }}
        sx={{ m: 1 }}
        value={value}
        onChange={(v) => setValue(v)}
        skipStep={10}
        noCleanIcon
      />
      <ActionButton sx={{ m: 1 }} onClick={handleClick}>
        Action button
      </ActionButton>
      <ActionFilter
        sx={{ m: 1 }}
        data={{ "first-filter": "second-item" }}
        actions={actions_filter}
        onChange={console.log}
      />
      <ActionTrigger
        sx={{ m: 1 }}
        actions={actions_trigger}
        onAction={handleClick}
      />
      <ActionIcon sx={{ m: 1 }} onClick={handleClick}>
        <AddIcon />
      </ActionIcon>
      <ActionStopIcon onClick={handleClick} sx={{ m: 1 }}>
        <DeleteIcon />
      </ActionStopIcon>
      <ActionStopIcon onClick={handleClick} sx={{ m: 1 }} />
      <ActionStopIcon onClick={handleClick} noProgress sx={{ m: 1 }} />
      <ActionToggle onClick={handleClick} defaultChecked sx={{ m: 1 }} />
      <ActionFab sx={{ m: 1 }} onClick={handleClick}>
        <AddIcon />
      </ActionFab>
      <Button sx={{ m: 1 }} onClick={handlePrompt}>
        Prompt
      </Button>
      <Button sx={{ m: 1 }} onClick={handleModal}>
        Modal
      </Button>
      {isPhone && "Phone"}
      {isTablet && "Tablet"}
      {isDesktop && "Desktop"}
      <InfiniteView
        component={Paper}
        sx={{
          width: "100%",
          height: 250,
          mb: 1,
        }}
        onDataRequest={() => {
          console.log("data-request");
          setItems1((items) => [
            ...items,
            ...[uuid(), uuid(), uuid(), uuid(), uuid()],
          ]);
        }}
      >
        {items1.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </InfiniteView>
      <VirtualView
        component={Paper}
        sx={{
          width: "100%",
          height: 250,
          mb: 1,
        }}
        onDataRequest={() => {
          console.log("data-request");
          setItems2((items) => [
            ...items,
            ...[uuid(), uuid(), uuid(), uuid(), uuid()],
          ]);
        }}
      >
        {items2.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </VirtualView>
      <RdGrid
        columns={columns}
        rowActions={actions}
        data={mock}
        header={<p>123</p>}
        sx={{
          mb: 1,
          height: 550,
        }}
      />
      {render()}
      <RecordView sx={{ minHeight: "300px" }} withExpandAll data={recordData} />
      <CardView
        sx={{
          height: 300,
        }}
        formatMedia={() => <div style={{ background: '#333', height: '100px' }}></div>}
        handler={async (search, skip) => {
          console.log("cardview", { search, skip });
          await sleep(3_000);
          return [
            {
              id: uuid(),
              idx: 0,
              foo: "1",
              bar: "1",
              baz: "1",
            },
            {
              id: uuid(),
              idx: 1,
              foo: "1",
              bar: "1",
              baz: "1",
            },
            {
              id: uuid(),
              idx: 2,
              foo: "1",
              bar: "1",
              baz: "1",
            },
            {
              id: uuid(),
              idx: 3,
              foo: "1",
              bar: "1",
              baz: "1",
            },
            {
              id: uuid(),
              idx: 4,
              foo: "1",
              bar: "1",
              baz: "1",
            },
          ];
        }}
        operations={[
          {
            action: "test1-action",
            label: "test1",
            isAvailable: (items) => items.some(({ idx }) => idx % 2 === 0),
          },
          {
            action: "test2-action",
            label: "test2",
            isAvailable: (items) => items.some(({ idx }) => idx % 2 === 1),
          },
        ]}
        cardActions={[
          {
            action: 'test2-action',
            label: 'Test action',
          },
        ]}
        onOperation={console.log}
        skipStep={5}
      />
      <FeatureView features={features} />
      <Countdown expireAt={new Date(Date.now() + 60 * 60 * 60 * 100)} />
      <Spinner />
      <DocumentView options={options} withDelete withFullScreen sx={{ height: 200 }} src="https://en.wikipedia.org/wiki/Cat" />
      <ImageView options={options} withDelete withFullScreen sx={{ height: 200 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1280px-Cat_August_2010-4.jpg" />
      <FilesView accept=".png" items={["1.png", "2.png", "3.png"]} />
      <MasterDetail
        title="test"
        sx={{
          height: '300px',
        }}
        options={items}
        mode={MasterDetailMode.Tabs}
      >
        123
      </MasterDetail>
      <ColorButton
        value={color}
        onChange={setColor}
      />
    </>
  );
};

export default FadePage;
