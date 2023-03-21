# ⚛️ react-declarative

> Developer notes

## React: declarative vs imperative

> What is the declarative programming?

Declarative programming is when a more qualified specialist writing code in a way when its behavior can be changed by using external config which represent oriented graph of objects. For example, [Jetpack Compose](https://developer.android.com/jetpack/compose) or [Flutter Widgets](https://docs.flutter.dev/development/ui/widgets).

Legacy solutions had used an `xml-like markup languages` which represented ui object tree. For example, [XAML in WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/xaml) (see [FuncUI](https://funcui.avaloniaui.net/)) or [*.ui in Qt](https://doc.qt.io/qt-6/designer-using-a-ui-file.html). They still have internal object composition syntax (like [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)) but it is highly recomended to use markup language to implement the UI in a declarative way.

After [Facebook introduced JSX](https://reactjs.org/docs/introducing-jsx.html) the whole enterprise migrated to web because it gives to developer more accessibility to design features and customize user experience by using `functional programming` (code significantly cheaper). In that case, `JSX` is declarative to `HTML` (more correct `DOM API` -> `HTML` -> `JSX`)

If you studied computer science you must know that everything in software [is built on top of abstractions](https://en.wikipedia.org/wiki/Architecture_of_macOS). For example in macOS `hardware` is used by `mach kernel`. `Mach kernel` is used by `Core OS`. `Core OS` is used by `QuckTime`. `QuickTime` is used by `GUI`. As you can see, [the subject of the relation](https://en.wikipedia.org/wiki/Subject_(philosophy)) is declarative to the object of the relationship

My idea is simple. If `C/C++ language` is declarative to `assembly`, `JavaScript` is declarative to `C++`, `React` is declarative to `JavaScript` why don't we build something which will reduce cost of app development when using React (`DOM API` -> `HTML` -> `Plain JS objects` -> `JSX`)?

As a result I had implemented a framework which can handle [the most usecases of the material guidelines](https://m2.material.io/components) usage with avalibility to fallback into vanilla JSX way of React development. That tool makes your code more functional because It removes the mostly used imperative parts of the virgin source code.

So this is definitely the next step on the direction based on top of historical evolution of the UI development way. The community has come up with a new term to define this phenomenon, It called [low code](https://en.wikipedia.org/wiki/Low-code_development_platform).

The `react-declarative` framework is the best low code solution because you still have `webpack`, `node_modules`, `package.json` and the full control on the source code.

In comparison with imperative programming in declarative programming we are not creating component instances manually by using [new operator](https://doc.qt.io/qt-6/qwidget.html#details) or similar (see [Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)). The difference is in more [SOLID](https://en.wikipedia.org/wiki/SOLID) way when using declarative constructions instead of imperative code.

## Fractal pattern (fractal project structure)

> Fractal pattern conveys that similar patterns recur progressively and the same thought process is applied to the structuring of codebase i.e All units repeat themselves.

**Pros of fractal**

1. All pros of [Domain driven design](https://en.wikipedia.org/wiki/Domain-driven_design)

2. Easy migration to [Microfrontend](https://en.wikipedia.org/wiki/Microfrontend)

**Cons of fractal**

1. In Windows NT maximum path length is [260 symbols](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation)

2. [CRA](https://create-react-app.dev/) works slower with fractal architecture (due to WebPack usage). When the bundle size increase we need to use [monorepo](https://github.com/nrwl/nx) with [module federation](https://webpack.js.org/concepts/module-federation/)

```text
├── src                       # Application source code
│   ├── components            # Reusable Presentational Components
│   ├── assets                # Required assets
│   ├── layouts               # Components that dictate major page structure
│   └── routes                # Main route definitions and async split points
│       ├── index.js          # Bootstrap main application routes with store
│       │
│       └── Route1
│       │    ├── index.js     # Route definitions and async split points
│       │    ├── components   # Presentational React Components
│       │    ├── assets       # Assets required to render components
│       │
│       └── Route2
│       │    ├── index.js     # Route definitions and async split points
│       │    ├── components   # Presentational React Components
│       │    ├── assets       # Assets required to render components
```

## SOLID in react-declarative

> SOLID principles described by simple words with examples in a source code

1. **[Single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)**

    The [EventEmitter](./src/utils/rx/EventEmitter.ts) does only event broadcast. Subscription management and event filtering implemented in [Subject](./src/utils/rx/Subject.ts) and [Observer](./src/utils/rx/Observer.ts)

2. **[Open–closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)**

    The latest value of [Subject](./src/utils/rx/Subject.ts) is stored in [BehaviorSubject](./src/utils/rx/BehaviorSubject.ts)

3. **[Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)**

    The components props (for example, [IOneProps](./src/model/IOneProps.ts#26)) are using [TSubject](./src/model/TSubject.ts) instead of [Subject](./src/utils/rx/Subject.ts) so the developer can easy use [rxjs](https://rxjs.dev/) or similar implementation

4. **[Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)**

    [BehaviorSubject](./src/utils/rx/BehaviorSubject.ts) extends [Subject](./src/utils/tx/Subject.ts), which using an [Observer](./src/utils/rx/Observer.ts). But if you check it's source code you will notice than it implements [TBehaviorSubject](./src/model/TBehaviorSubject.ts) and [TObservable](./src/model/TObserver.ts) both. This posible due to the interfaces don't overlap each other

5. **[Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)**

    When you are using [IField](./src/model/IField.ts) object tree provided to [<One />](./src/components/One/) props you are not making component instances manually. The declarative programming makes dependency inversion by itself. If the answer is not good enough, see [provide and inject](./src/helpers/serviceManager.ts) and [Angular2 dependency injection](https://angular.io/guide/dependency-injection)
    