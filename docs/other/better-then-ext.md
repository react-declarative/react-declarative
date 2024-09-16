# The revolution for ExtJS approach in react-declarative

> Someone told me that `react-declarative` is ExtJS reimplementation. This is not quite right

## The two main code styles of OOP

There are two main code styles of OOP used in enterprise: `class-oriented` and `component-oriented`. The diffrence is the `class-oriented` hides mutable state to prevent side effects, the `component-oriented` makes state immutable. The problem is the first code style makes code inaccessible to implementing new features. This is critical when publishing app to mass market

### Class-Oriented Design 

In class-oriented design: 

1. **Classes** : Define the structure and behavior of objects. A class is a blueprint for creating objects, encapsulating data (attributes) and methods (functions) that operate on the data.
 
2. **Inheritance** : Allows one class to inherit properties and behaviors from another class, promoting code reuse and hierarchical relationships.
 
3. **Encapsulation** : Bundles data and methods that operate on that data within a class, restricting direct access to some of the object's components.
 
4. **Polymorphism** : Enables objects to be treated as instances of their parent class rather than their actual class, allowing for flexible and interchangeable object usage.
 
5. **Abstraction** : Provides a simplified view of complex systems by hiding the implementation details and exposing only the necessary functionality.

**Example** : In a class-oriented design, you might have a `Vehicle` class with subclasses like `Car` and `Truck`. Each subclass inherits attributes and methods from `Vehicle` but can also have additional properties and behaviors specific to that type of vehicle.

```tsx
// Define a base class
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  start() {
    console.log(`${this.make} ${this.model} is starting.`);
  }

  stop() {
    console.log(`${this.make} ${this.model} is stopping.`);
  }
}

// Define a subclass
class Car extends Vehicle {
  constructor(make, model, numDoors) {
    super(make, model);
    this.numDoors = numDoors;
  }

  honk() {
    console.log(`${this.make} ${this.model} is honking.`);
  }
}

// Define another subclass
class Truck extends Vehicle {
  constructor(make, model, cargoCapacity) {
    super(make, model);
    this.cargoCapacity = cargoCapacity;
  }

  loadCargo() {
    console.log(`${this.make} ${this.model} is loading cargo.`);
  }
}

// Usage
const myCar = new Car('Toyota', 'Camry', 4);
myCar.start();
myCar.honk();

const myTruck = new Truck('Ford', 'F-150', 1000);
myTruck.start();
myTruck.loadCargo();
```


### Component-Oriented Design 

In component-oriented design:

1. **Components** : Are self-contained units of functionality with well-defined interfaces. They can be assembled together to form complex systems.
 
2. **Loose Coupling** : Components interact with each other through interfaces, promoting flexibility and ease of maintenance. This means components are less dependent on the internal workings of other components.
 
3. **Reusability** : Components are designed to be reusable across different systems or applications. They are modular and can be plugged in or replaced with minimal impact on the overall system.
 
4. **Composition Over Inheritance** : Emphasizes building complex systems by composing simpler components rather than relying on inheritance hierarchies.
 
5. **Encapsulation** : Similar to class-oriented design, components encapsulate their internal state and behavior, exposing only what is necessary through their interfaces.

**Example** : In a component-oriented design, you might have a `LoginComponent`, a `PaymentComponent`, and a `NotificationComponent`. Each of these components handles a specific aspect of functionality and can be used in various applications without needing to understand the internal workings of other components.

```tsx
class LoginController {
    loginComponent(username, password) {
        console.log(`Logging in ${username} with password ${password}`);
    }

    paymentComponent(amount, method) {
        console.log(`Processing payment of ${amount} using ${method}`);
    }

    notificationComponent(message) {
        console.log(`Sending notification: ${message}`);
    }
}

const loginController = inject(LoginController)

loginController.notificationComponent('Payment successful!');
```

## Let's analyze the code

The fundamental mistake of ExtJS software design makes it extremely painful and expensive to maintain. Here is the cases

### Data Grid

**ExtJS**

As you can see, in the `initComponent` method the grid schema is assigned to class instance. That means It will be mutated in the code behind the interface

```tsx
Ext.define('KitchenSink.view.grid.ArrayGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.column.Action'
    ],
    xtype: 'array-grid',
    store: 'Companies',
    stateful: true,
    collapsible: true,
    multiSelect: true,
    stateId: 'stateGrid',
    height: 350,
    title: 'Array Grid',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    initComponent: function () {
        this.width = 600;
        this.columns = [
            {
                text     : 'Company',
                flex     : 1,
                sortable : false,
                dataIndex: 'company'
            },
            {
                text     : 'Price',
                width    : 75,
                sortable : true,
                renderer : 'usMoney',
                dataIndex: 'price'
            },
            {
                text     : 'Change',
                width    : 80,
                sortable : true,
                renderer : function(val) {
                    if (val > 0) {
                        return '<span style="color:' + 'green' + ';">' + val + '</span>';
                    } else if (val < 0) {
                        return '<span style="color:' + 'red' + ';">' + val + '</span>';
                    }
                    return val;
                },
                dataIndex: 'change'
            },
            {
                text     : '% Change',
                width    : 75,
                sortable : true,
                renderer : function(val) {
                    if (val > 0) {
                        return '<span style="color:' + 'green' + '">' + val + '%</span>';
                    } else if (val < 0) {
                        return '<span style="color:' + 'red' + ';">' + val + '%</span>';
                    }
                    return val;
                },
                dataIndex: 'pctChange'
            },
            {
                text     : 'Last Updated',
                width    : 85,
                sortable : true,
                renderer : Ext.util.Format.dateRenderer('m/d/Y'),
                dataIndex: 'lastChange'
            },
            {
                menuDisabled: true,
                sortable: false,
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    iconCls: 'sell-col',
                    tooltip: 'Sell stock',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
                    }
                }, {
                    getClass: function(v, meta, rec) {
                        if (rec.get('change') < 0) {
                            return 'alert-col';
                        } else {
                            return 'buy-col';
                        }
                    },
                    getTip: function(v, meta, rec) {
                        if (rec.get('change') < 0) {
                            return 'Hold stock';
                        } else {
                            return 'Buy stock';
                        }
                    },
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex),
                            action = (rec.get('change') < 0 ? 'Hold' : 'Buy');

                        Ext.Msg.alert(action, action + ' ' + rec.get('company'));
                    }
                }]
            }
        ];

        this.callParent();
    }
});
```


**React Declarative**

In that sample, the grid schema is defined externally which makes the schema immutable: It could be reused for other features like data serialization for Excel export. The column interface is extended with `serialize` pure function which allow excel export of images

```tsx
interface ICustomColumn<T> extends IColumn<T> {
    serialize: (data: T) => string | (Promise<string>);
}

const columns: ICustomColumn<IApartmentRow>[] = [
  {
    type: ColumnType.Compute,
    sortable: false,
    field: "index",
    description: "Object Number",
    headerName: "Number",
    element: ({ index }) => (
      <CopyButton
        delay={800}
        variant="text"
        color="warning"
        content={index}
        label={`№${index}`}
      />
    ),
    width: () => 140,
  },
  {
    type: ColumnType.Compute,
    sortable: false,
    field: "photo",
    description: "Object Photo",
    headerName: "Photo",
    serialize: async ({ apartment_images }) => {
      const image = first(apartment_images) || "";
      return image ? await ioc.appwriteService.getFileURL(image) : "";
    },
    width: () => 185,
    element: ImagePreview,
  },
  {
    type: ColumnType.Compute,
    pin: true,
    field: "$createdAt",
    description: "Creation Date",
    headerName: "Created",
    compute: ({ $createdAt }) => dayjs($createdAt).format("DD/MM/YYYY"),
    width: () => 160,
  },
  {
    type: ColumnType.Compute,
    pin: true,
    field: "$updatedAt",
    description: "Update Date",
    headerName: "Updated",
    compute: ({ $updatedAt }) => dayjs($updatedAt).format("DD/MM/YYYY"),
    width: () => 160,
  },
];

<List
    columns={columns}
/>
```

### Dynamic Forms

**ExtJS**

I don't know what to say about this: HOW DO I MAKE THIS RESPONSIVE for different form factors of devices? Why do I need to query-selector elements on page? What if there are number of forms of page with the same schema but diffrent ids?

```tsx
Ext.create('Ext.form.Panel', {
    bodyPadding: 10,
    width: 300,
    title: 'Pizza Order',
    items: [
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Toppings',
            defaultType: 'checkboxfield',
            items: [
                {
                    boxLabel  : 'Anchovies',
                    name      : 'topping',
                    inputValue: '1',
                    id        : 'checkbox1'
                }, {
                    boxLabel  : 'Artichoke Hearts',
                    name      : 'topping',
                    inputValue: '2',
                    checked   : true,
                    id        : 'checkbox2'
                }, {
                    boxLabel  : 'Bacon',
                    name      : 'topping',
                    inputValue: '3',
                    id        : 'checkbox3'
                }
            ]
        }
    ],
    bbar: [
        {
            text: 'Select Bacon',
            handler: function() {
                Ext.getCmp('checkbox3').setValue(true);
            }
        },
        '-',
        {
            text: 'Select All',
            handler: function() {
                Ext.getCmp('checkbox1').setValue(true);
                Ext.getCmp('checkbox2').setValue(true);
                Ext.getCmp('checkbox3').setValue(true);
            }
        },
        {
            text: 'Deselect All',
            handler: function() {
                Ext.getCmp('checkbox1').setValue(false);
                Ext.getCmp('checkbox2').setValue(false);
                Ext.getCmp('checkbox3').setValue(false);
            }
        }
    ],
    renderTo: Ext.getBody()
});
```

**React Declarative**

Build in mobile first approach

```tsx
const fields: TypedField[] = [
  {
    type: FieldType.Paper,
    fieldBottomMargin: "1",
    fields: [
      {
        type: FieldType.Typography,
        typoVariant: "h6",
        placeholder: "General Information",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "first_name",
        title: "First Name",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "last_name",
        title: "Last Name",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "middle_name",
        title: "Middle Name",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "phone",
        title: "Phone",
        inputFormatterAllowed: /^[0-9]/,
        inputFormatterTemplate: "000000000000000",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "additional_phone",
        title: "Additional Phone",
        inputFormatterAllowed: /^[0-9]/,
        inputFormatterTemplate: "000000000000000",
      },
      {
        type: FieldType.Text,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "email",
        title: "Email",
      },
      {
        type: FieldType.Items,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "source",
        title: "Source",
        itemList: ["Telegram", "Facebook", "Instagram"],
      },
      {
        type: FieldType.Items,
        desktopColumns: "4",
        tabletColumns: "4",
        phoneColumns: "12",
        outlined: false,
        name: "looking_for",
        title: "Looking For",
        itemList: ["House", "Garage"],
      },
    ],
  },
];

<One
    fields={fields}
/>
```

### Theming

**ExtJS**

Cause the can't access the classes implementation, the styling is restricted to `CSS`. That means you simply can't implement custom popovers for calendars, custom input pattern for banking cards, custom country select for mobile phones and more. You need to manually rewrite the fields and replace them in the whole code base which make It more difficult then rewrite from scratch the whole application

```css
$sub-header-background-color: rgba(242,223,239,1);
$neutral-light-color: $sub-header-background-color;
$container-background-color: #fff;
$toolbar-background-color: #f4f4f4;
$toolbar-separator-color: darken($toolbar-background-color, 20%);
$header-color: #fff;
$panel-header-background-color: $sub-header-background-color;
$panel-body-background-color: $container-background-color;
$header-gradient: "flat";
$panel-body-gradient: "flat";
$panel-frame-background-color: $container-background-color;
$body-background-color: rgba(231,243,228,1);
$base-color: darken($body-background-color, 20%);
$base-highlight-color: lighten($body-background-color, 10%);
$base-dark-color: darken($body-background-color, 10%);
$base-color: rgba(241,21,204,1);
$form-field-border-color: lighten($base-color, 20%);
$form-field-focus-border-color: $base-color;
$form-field-invalid-background-color: $container-background-color;
$grid-row-cell-background-color: $container-background-color;
$grid-row-cell-alt-background-color: darken($grid-row-cell-background-color, 5%);
$grid-row-cell-over-background-color: darken($grid-row-cell-background-color, 10%);
$grid-row-cell-selected-background-color: darken($grid-row-cell-background-color, 15%);
$grid-header-over-background-color: $neutral-light-color;
$grid-header-background-color: $neutral-light-color;
$grid-header-border-color: darken($grid-header-background-color, 20%);
$grid-header-over-border-color: $grid-header-border-color;
$grid-header-background-gradient: darken($grid-header-background-color, 10%);
$sub-header-color: #666;
$sub-header-header-color: $sub-header-color;
$button-default-color: #666;
$button-default-background-color: $button-color;
$button-toolbar-color: $button-color;
$button-toolbar-background-color: $button-color;
$base-dark-color: mix(black, $base-color, 14%);
$button-toolbar-border-color: $base-dark-color;
$button-toolbar-background-gradient: $button-gradient;
$button-default-background-gradient: $button-gradient;
$button-toolbar-background-gradient: $button-gradient;
$tab-base-color: $base-color;
$tab-background-gradient: $header-gradient;
$tabbar-strip-background-color: $tab-base-color;
$btn-group-background-color: $tab-background-color;
$btn-group-header-color: $sub-header-color;
$btn-group-border-color: $container-background-color;
$btn-group-inner-border-color: darken($btn-group-background-color, 20%);
$btn-group-header-background-color: darken($btn-group-background-color, 20%);
$boundlist-background-color: $container-background-color;
$boundlist-item-over-background-color: darken($boundlist-background-color, 10%);
$boundlist-item-selected-background-color: darken($boundlist-background-color, 20%);
$datepicker-background-color: $container-background-color;
$datepicker-column-header-background-color: darken($datepicker-background-color, 20%);
$datepicker-item-selected-background-color: darken($datepicker-background-color, 10%);
$datepicker-item-hover-background-color: darken($datepicker-background-color, 15%);
$datepicker-today-item-background-color: darken($datepicker-background-color, 20%);
$colorpicker-item-border-color: $sub-header-color;
$colorpicker-over-border-color: darken($colorpicker-item-border-color, 20%);
$colorpicker-item-inner-border-color: darken($colorpicker-item-border-color, 10%);
$menu-background-color: $sub-header-color;
$menu-text-color: #fff;
$menu-item-active-background-color: darken($menu-background-color, 10%);
$menu-item-background-gradient: $menu-background-color;
$menu-separator-border-color: darken($menu-background-color, 20%);
$menu-separator-background-color: lighten($menu-background-color, 20%);
$color: #666;
$base-color: $color;
$neutral-color: rgba(247,234,234,1);
```

**React Declarative**

By using slots approach you can access `JS` and `CSS` both: there are no restrictions

```tsx
import { MantineProvider } from "@mantine/core";
import { OneSlotFactory } from "react-declarative-mantine";

const wrappedApp = (
    <MantineProvider>
        <OneSlotFactory>
            <App />
        </OneSlotFactory>
    </MantineProvider>
);
```
