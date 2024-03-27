# Routing

The routing for Material Design app required usage Scaffold component. The Scaffold use AppBar (html header) and NavBar (html aside) components

## The `<Switch />` config

Switch component navigates the views by using the browser current url. Here's a sample config for routes

```tsx
export interface IRouteItem extends ISwitchItem {
  sideMenu?: string;
}

export const baseRoutes: IRouteItem[] = [
  {
    path: '/error_page',
    element: ErrorPage,
  },
  {
    path: '/login_page',
    element: LoginPage,
  },
  {
    path: '/register_page',
    element: RegisterPage,
  },
  {
    path: '/inactive_page',
    element: InactivePage,
  },
];

const viewRoutes: IRouteItem[] = [
  // Ticket routes
  {
    path: '/ticket',
    sideMenu: "root.report.ticket",
    guard: () => ioc.authService.hasFeature("ticket_read"),
    element: TicketListPage,
  },
  {
    path: '/ticket/:id',
    sideMenu: "root.report.ticket",
    guard: () => ioc.authService.hasFeature("ticket_read"),
    redirect: ({ id }) => `/ticket/${id}/card`,
  },
  {
    path: '/ticket/:id/card',
    sideMenu: "root.report.ticket",
    guard: () => ioc.authService.hasFeature("ticket_read"),
    element: TicketOnePage,
  },
  {
    path: '/ticket/:id/bids',
    sideMenu: "root.report.ticket",
    guard: () => ioc.authService.hasFeature("ticket_read"),
    element: TicketBidsPage,
  },
  {
    path: '/dashboard',
    sideMenu: "root.report.dashboard",
    guard: () => ioc.authService.hasFeature("dashboard_read"),
    element: DashboardPage,
  },
  // Apartment routes
  {
    path: '/apartment',
    sideMenu: "root.building.apartment",
    guard: () => ioc.authService.hasFeature("apartment_read"),
    element: ApartmentListPage,
  },
  {
    path: '/apartment/:id',
    sideMenu: "root.building.apartment",
    guard: () => ioc.authService.hasFeature("apartment_create", "apartment_update"),
    redirect: ({ id }) => `/apartment/${id}/card`,
  },
  {
    path: '/apartment/:id/card',
    sideMenu: "root.building.apartment",
    guard: () => ioc.authService.hasFeature("apartment_create", "apartment_update"),
    element: ApartmentOnePage,
  },
  {
    path: '/apartment/:id/files',
    sideMenu: "root.building.apartment",
    guard: () => ioc.authService.hasFeature("apartment_create", "apartment_update"),
    element: ApartmentFilesPage,
  },
  {
    path: '/apartment/:id/images',
    sideMenu: "root.building.apartment",
    guard: () => ioc.authService.hasFeature("apartment_create", "apartment_update"),
    element: ApartmentImagesPage,
  },
  {
    path: '/apartment_group',
    sideMenu: "root.building.apartment_group",
    guard: () => ioc.authService.hasFeature("apartment_group_read"),
    element: ApartmentGroupListPage,
  },
  {
    path: '/apartment_housing_type',
    sideMenu: "root.building.apartment_housing_type",
    guard: () => ioc.authService.hasFeature("apartment_housing_type_read"),
    element: ApartmentHousingTypeListPage,
  },
  {
    path: '/apartment_material_type',
    sideMenu: "root.building.apartment_material_type",
    guard: () => ioc.authService.hasFeature("apartment_material_type_read"),
    element: ApartmentMaterialTypeListPage,
  },
  {
    path: '/apartment_district',
    sideMenu: "root.building.apartment_district",
    guard: () => ioc.authService.hasFeature("apartment_district_read"),
    element: ApartmentDistrictListPage,
  },
  {
    path: '/apartment_metro',
    sideMenu: "root.building.apartment_metro",
    guard: () => ioc.authService.hasFeature("apartment_metro_read"),
    element: ApartmentMetroListPage,
  },
  // Profile routes
  {
    path: '/profile',
    sideMenu: "root.customer.profile",
    guard: () => ioc.authService.hasFeature("profile_read"),
    element: ProfileListPage,
  },
  {
    path: '/profile_group',
    sideMenu: "root.customer.profile_group",
    guard: () => ioc.authService.hasFeature("profile_group_read"),
    element: ProfileGroupListPage,
  },
  {
    path: '/profile_source',
    sideMenu: "root.customer.profile_source",
    guard: () => ioc.authService.hasFeature("profile_source_read"),
    element: ProfileSourceListPage,
  },
  {
    path: '/profile_looking_for',
    sideMenu: "root.customer.profile_looking_for",
    guard: () => ioc.authService.hasFeature("profile_looking_for_read"),
    element: ProfileLookingForListPage,
  },
  {
    path: '/profile/:id',
    sideMenu: "root.customer.profile",
    guard: () => ioc.authService.hasFeature("profile_update"),
    redirect: ({ id }) => `/profile/${id}/card`,
  },
  {
    path: '/profile/:id/card',
    sideMenu: "root.customer.profile",
    guard: () => ioc.authService.hasFeature("profile_update"),
    element: ProfileOnePage,
  },
  {
    path: '/profile/:id/files',
    sideMenu: "root.customer.profile",
    guard: () => ioc.authService.hasFeature("profile_update"),
    element: ProfileFilesPage,
  },
  // User routes
  {
    path: '/user',
    sideMenu: "root.admin.user",
    guard: () => ioc.authService.hasRole("admin"),
    element: UserListPage,
  },
  {
    path: '/user/:id',
    sideMenu: "root.admin.user",
    redirect: ({ id }) => `/user/${id}/card`,
  },
  {
    path: '/user/:id/card',
    sideMenu: "root.admin.user",
    guard: () => ioc.authService.hasRole("admin"),
    element: UserOnePage,
  },
  {
    path: '/user/:id/features',
    sideMenu: "root.admin.user",
    guard: () => ioc.authService.hasRole("admin"),
    element: UserFeaturePage,
  },
  {
    path: '/user/:id/files',
    sideMenu: "root.admin.user",
    guard: () => ioc.authService.hasRole("admin"),
    element: UserFilesPage,
  },
  {
    path: '/settings',
    sideMenu: "root.admin.settings",
    guard: () => ioc.authService.hasRole("admin"),
    element: SettingsPage,
  },
];

export const routes: IRouteItem[] = [
  {
    path: '/',
    redirect: () => {
      if (ioc.authService.isAuthorized) {
        return "/profile";
      }
      return "/login_page";
    },
  },
  ...viewRoutes,
  ...baseRoutes,
];

export const sideMenuClickMap: Record<string, string> = {
  "root.report.ticket": "/ticket",
  "root.report.dashboard": "/dashboard",
  "root.building.apartment": "/apartment",
  "root.building.apartment_group": "/apartment_group",
  "root.building.apartment_district": "/apartment_district",
  "root.building.apartment_housing_type": "/apartment_housing_type",
  "root.building.apartment_material_type": "/apartment_material_type",
  "root.building.apartment_metro": "/apartment_metro",
  "root.customer.profile": "/profile",
  "root.customer.profile_group": "/profile_group",
  "root.customer.profile_source": "/profile_source",
  "root.customer.profile_looking_for": "/profile_looking_for",
  "root.admin.user": "/user",
  "root.admin.settings": "/settings",
};

export const handleTabChange = (path: string) => {
  const params = getRouteParams();
  if (path === "root.admin.user.features") {
    ioc.routerService.push(`/user/${params.id}/features`);
  }
  if (path === "root.admin.user.card") {
    ioc.routerService.push(`/user/${params.id}/card`);
  }
  if (path === "root.admin.user.files") {
    ioc.routerService.push(`/user/${params.id}/files`);
  }

  if (path === "root.report.ticket.card") {
    ioc.routerService.push(`/ticket/${params.id}/card`);
  }
  if (path === "root.report.ticket.bids") {
    ioc.routerService.push(`/ticket/${params.id}/bids`);
  }

};

export default routes;
```

Let's break it down: 

1. Import Statements: 

- The code imports various components from different files in the project, such as `ApartmentFilesPage`, `ProfileFilesPage`, `UserFeaturePage`, etc. 
- It also imports utility functions like `getRouteParams` and dependencies like `react-declarative`. 

2. Interface Declaration: 

- The code declares an interface `IRouteItem` which extends `ISwitchItem` from `react-declarative`. This interface seems to define properties for route items. 

3. Route Definitions: 

- It defines routes for different pages of the application. Each route includes properties like `path`, `element`, `guard`, and `sideMenu`. 
- Routes are categorized into `baseRoutes` and `viewRoutes`. 
- Routes have guards that check whether the user has certain permissions or roles (`ioc.authService.hasFeature`, `ioc.authService.hasRole`).
- Some routes also have redirects based on certain conditions. 

4. Default Route and Side Menu Mapping:
- A default route is specified which redirects users to either the profile page or the login page based on whether the user is authorized.
- There's a mapping for side menu items to their respective routes. 

5. `handleTabChange` Function:

- This function seems to handle tab changes within the application. 
- It uses the `getRouteParams` function to get parameters from the current route. 
- Based on the path provided, it uses the `ioc.routerService.push` method to navigate to different routes. 

6. Export:

- The code exports the defined routes and a mapping for side menu clicks.

## The `<Scaffold2 />` config

The `<Scaffold2 />` takes a `<Switch />` as a children and draws the base container with application header and aside. Also it shows tabs in header. An active tab is shown by a route match. Also it highlights the active sidebar item by it's dot joined ids path by comparing it with sideMenu property in current route.

```tsx
export const sidemenu: IScaffold2Group[] = [
  {
    id: "report",
    label: "Report",
    icon: WorkHistoryIcon,
    isVisible: () => or(
      ioc.authService.hasFeature('dashboard_read'),
      ioc.authService.hasFeature('ticket_read'),
    ),
    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        isVisible: async () => await ioc.authService.hasFeature('dashboard_read'),
        icon: SpeedIcon,
      },
      {
        id: "ticket",
        label: "Sales",
        isVisible: async () => await ioc.authService.hasFeature('ticket_read'),
        icon: CoffeeIcon,
        tabs: [
          {
            id: 'card',
            label: "Data",
            isVisible: () => and(
              hasRouteMatch([
                '/ticket/:id',
                '/ticket/:id/card',
                '/ticket/:id/bids',
              ]),
              getRouteParam('id') !== 'create',
            ),
            isActive: () =>  hasRouteMatch([
              '/ticket/:id',
              '/ticket/:id/card',
            ]),
          },
          {
            id: 'bids',
            label: "Bids",
            isVisible: () => and(
              hasRouteMatch([
                '/ticket/:id',
                '/ticket/:id/card',
                '/ticket/:id/bids',
              ]),
              getRouteParam('id') !== 'create',
            ),
            isActive: () =>  hasRouteMatch([
              '/ticket/:id',
              '/ticket/:id/bids',
            ]),
          },
        ],
      }
    ],
  },
  {
    id: "building",
    label: "Project",
    icon: HomeIcon,
    isVisible: () => or(
      ioc.authService.hasFeature('apartment_read'),
      ioc.authService.hasFeature('apartment_group_read'),
      ioc.authService.hasFeature('apartment_district_read'),
      ioc.authService.hasFeature('apartment_housing_type_read'),
      ioc.authService.hasFeature('apartment_material_type_read'),
      ioc.authService.hasFeature('apartment_metro_read'),
    ),
    children: [
      {
        id: "apartment",
        label: "Apartment",
        isVisible: async () => await ioc.authService.hasFeature('apartment_read'),
        icon: BusinessIcon,
      },
      {
        id: "apartment_group",
        label: "Apartment group",
        isVisible: async () => await ioc.authService.hasFeature('apartment_group_read'),
        icon: GradeIcon,
      },
      {
        id: "apartment_district",
        label: "District",
        isVisible: async () => await ioc.authService.hasFeature('apartment_district_read'),
        icon: MyLocationIcon,
      },
      {
        id: "apartment_housing_type",
        label: "Housing type",
        isVisible: async () => await ioc.authService.hasFeature('apartment_housing_type_read'),
        icon: ConstructionIcon,
      },
      {
        id: "apartment_material_type",
        label: "Material type",
        isVisible: async () => await ioc.authService.hasFeature('apartment_material_type_read'),
        icon: PaletteIcon,
      },
      {
        id: "apartment_metro",
        label: "Metro",
        isVisible: async () => await ioc.authService.hasFeature('apartment_metro_read'),
        icon: PlaceIcon,
      },
    ],
  },
  {
    id: "customer",
    label: "Customer",
    icon: ContactPhoneIcon,
    isVisible: () => or(
      ioc.authService.hasFeature('profile_read'),
      ioc.authService.hasFeature('profile_group_read'),
      ioc.authService.hasFeature('profile_source_read'),
      ioc.authService.hasFeature('profile_looking_for_read'),
    ),
    children: [
      {
        id: "profile",
        label: "Profiles",
        isVisible: async () => await ioc.authService.hasFeature('profile_read'),
        icon: FaceIcon,
      },
      {
        id: "profile_group",
        label: "Groups",
        isVisible: async () => await ioc.authService.hasFeature('profile_group_read'),
        icon: GroupsIcon,
      },
      {
        id: "profile_source",
        label: "Sources",
        isVisible: async () => await ioc.authService.hasFeature('profile_source_read'),
        icon: ConnectWithoutContactIcon,
      },
      {
        id: "profile_looking_for",
        label: "Looking for",
        isVisible: async () => await ioc.authService.hasFeature('profile_looking_for_read'),
        icon: PersonSearchIcon,
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    isVisible: () => ioc.authService.hasRole("admin"),
    icon: EngineeringIcon,
    children: [
      {
        id: "user",
        label: "Employee",
        icon: VerifiedUserIcon,
      },
      {
        id: "settings",
        label: "Settings",
        isVisible: () => ioc.authService.hasRole("admin"),
        icon: SettingsIcon,
      },
    ],
  },
];
```

- This code defines a data structure representing a side menu for a web application. Let's break it down: 

1. **Sidemenu Items** :

- This array contains objects representing different groups of items in the side menu. 
- Each group is represented by an object with properties like `id`, `label`, `icon`, `isVisible`, and `children`. 

2. **Group Definitions** : 
- Each group has an `id` and a `label` defining its identifier and display name respectively. 
- The `icon` property represents the icon associated with the group. 
- The `isVisible` property is a function that determines whether the group should be visible based on the user's permissions. It uses `ioc.authService` to check if the user has certain features or roles. 
- The `children` property contains an array of submenu items within each group. 

3. **Submenu Items** : 
- Each submenu item is represented by an object within the `children` array. 
- It has properties like `id`, `label`, `icon`, and `isVisible`. 
- The `isVisible` property determines whether the submenu item should be visible based on the user's permissions. 
- Some submenu items may have additional properties like `tabs`, `isActive`, etc., which provide more functionality related to navigation or UI state. 

4. **Conditional Visibility** : 
- The `isVisible` functions are defined using `async` and `await`, indicating that they might perform asynchronous operations to determine visibility based on user permissions. 

5. **Role-based Visibility** : 

- The visibility of certain groups and items is determined based on the user's role (`admin`).

Overall, this data structure defines a dynamic side menu that adapts its visibility and content based on the user's permissions and roles within the application.

- The `tabs` subarray within the `sidemenu` array appears to define additional navigation tabs for specific menu items. Let's break down its structure and functionality: 

1. **Structure** :

- Each item in the `tabs` subarray represents a tab within a specific menu item. 
- It contains objects with properties like `id`, `label`, `isVisible`, and `isActive`. 

2. **Properties** : 

- `id`: Identifies the tab. 
- `label`: Text displayed for the tab. 
- `isVisible`: Determines whether the tab should be visible. This property is a function returning a boolean value. 
- `isActive`: Determines whether the tab should be marked as active. This property is also a function returning a boolean value. 

3. **Visibility and Activation** : 

- The `isVisible` property controls the visibility of the tab based on certain conditions. It seems to be an asynchronous function that likely checks user permissions or other conditions. 
- The `isActive` property determines whether the tab should appear as active. It's likely used to highlight the currently selected tab. 
- Both `isVisible` and `isActive` functions seem to use various utility functions (`and`, `or`, `hasRouteMatch`, `getRouteParam`) to evaluate their conditions. 

4. **Usage** :

- These tabs likely provide a way to navigate between different views or functionalities within a specific section of the application.
- For instance, in the "Sales" menu item, there are tabs for "Data" and "Bids", which could represent different views or operations related to sales. 

5. **Dynamic Behavior** :

- It's notable that these properties' values are defined as functions, indicating that their evaluation might depend on dynamic factors such as user permissions or current route parameters.
- This allows for dynamic behavior in rendering and activating tabs based on runtime conditions.

In summary, the `tabs` subarray enhances the navigation structure by providing additional tabs within specific menu items. These tabs have dynamic visibility and activation based on conditions defined by functions.
