## Collection


This TypeScript class `Collection` extends `EventEmitter` and implements `ICollectionAdapter<T>`. The class is designed to manage and manipulate arrays of objects.

### Variables

- `_items` is a Map holding `Entity` objects. The key is an integer and the value is an Entity object.
- `_ids` is another Map which stores entity IDs as keys and their corresponding indexes in `_items` as values.
- `_dropChanges` is a Subject, which is an Observable that can be both observable and observer.

### Properties

- `items` returns an array of all the `Entity` objects sorted by the order of keys in the `_items`.
- `lastIdx` returns the index of the last entity in `_items`.
- `ids` property returns an array of all Entity ids present in the `_ids` Map.

### Methods

- The `_prevEntity` method returns a function that generates and returns the previous Entity if found, otherwise it returns the initial Entity data.
- The `_change` and `_refresh` methods emit `CHANGE_SYMBOL` and `REFRESH_SYMBOL` events respectively along with the collection instance and the target entity.
- `_reorder` method emits a `REORDER_SYMBOL` event with current Collection instance and null as arguments.
- `_dispose` method unsubscribes from `CHANGE_SYMBOL` and `REFRESH_SYMBOL` events for each Entity in `_items` and clears `_items` and `_ids`.

The `constructor` accepts an array `entities` of entities, a debounce time `_debounce`, and a function `_prevData` to get the previous status. It creates new `Entity` objects by taking an entity from `entities`, subscribing change and refresh events on these entities and adds these entities in `_items`.

- `isEmpty` checks if the collection is empty.
- `setData` sets the data for the collection and performs necessary operations including disposing previous data, creating new `Entities`, updating `_items` and `_ids`, and triggers reorder event.
- `clear` clears `_items` and `_ids`, and triggers reorder event.
- `map` and `filter` methods operate over the entities.
- `find` method finds an entity in the list of items based on the given predicate.

The class seems like a custom implementation of an observable array where Entity changes can be subscribed to and handled in an ordered manner. Each array item is wrapped in an Entity that emits a change event when it's updated. This would be useful in an application where real-time updates are necessary and components need to react as data changes.



## Entity

This TypeScript code describes a class `Entity` which extends `Model<T>`. The `T` is a type placeholder and an extension of the `IEntity` interface. Here's a walkthrough of the code:

**Entity class declaration and constructor:**

```typescript
export class Entity<T extends IEntity = any> extends Model<T> implements IEntityAdapter<T> {
    constructor(_data: T | Entity<T> | (() => T), _debounce = CHANGE_DEBOUNCE, _prevData = () => this._data) {
        super(_data, _debounce, _prevData);
    };
    // ...
}
```

- `Entity` class holds and manages an `IEntity` object, a base type for an entity with an identifier (via `id` field). It also implements the `IEntityAdapter<T>` interface.
- It extends the base `Model<T>`, and initializes it with the `_data` parameter (which can be an instance of `T`, `Entity<T>`, or a function that returns `T`), `_debounce` parameter with a default of `CHANGE_DEBOUNCE`, and a function `_prevData` which returns the value of `_data`.
- By extending Model and implementing IEntityAdapter, the Entity class needs to respect certain properties, methods, and their behavior as defined in the parent class and in the IEntityAdapter interface.

**Getter for id:**

```typescript
public get id() {
    return this._data.id;
};
```
This is a `getter` function that returns the `id` of the entity, which is a property of the `_data` field.

**setData method:**

```typescript
public setData = (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
    if (typeof data === 'function') {
        data = data(this._prevData());
    }
    if (data.id === undefined) {
        data.id = randomString();
    }
    super.setData({
        ...data,
    });
};
```
This method allows updating the data of the Entity. It takes an object that is a partial struct of `T` or a function that takes the previous `data` and returns a new `data` object. 

- If a function is passed, it retrieves the previous data, invokes this function with the previous data and updates the current data with the returned value.
- If the `id` is undefined within the returned data, it generates a new `id` using the `randomString` function.
- Finally using `super.setData(...)`, it propagates the changes to the base `Model` class. 

**handleChange method:**

```typescript
public handleChange = (change: (item: Entity<T>) => void): () => void => {
    return super.handleChange(change as (item: Model<T>) => void);
};
```
This method allows for clients to subscribe to state changes of the `Entity`. Clients can pass a function that takes the changed Entity as an argument and `handleChange` returns a cleanup function to unsubscribe. The change listener is then passed to the base Model class’s `handleChange` method using `super`. 

The provided TypeScript code snippet uses generics, inheritance, and implements a specific interface to build a data wrapper class around an entity that allows getting, setting of data, and subscribing to change events. It is part of the Model-View-ViewModel (MVVM) architectural pattern.


## Model

The given TypeScript code defines a class called `Model` that extends from `EventEmitter` and implements the `IModelAdapter`. Here's a simplified breakdown of what the code does:

1. **Generics**: The class `Model<T extends {} = any>` uses generic type `T` which extends from an empty object or defaults to `any` type. This allows the Model class to handle data of any type specified at the time of instantiation.

2. **Fields**: The class has three fields: 
    - `_dropChanges` is a new instance of `Subject<void>`.
    - `_data` holds data of generic type `T`.
    - `_change` is a method that emits a `CHANGE_SYMBOL` event, with `this` as the payload.

3. **Methods**:
    - `data`: Getter for `_data`, returns a frozen version of `_data` i.e., a non-modifiable copy.
    - `constructor`: Initializes `_data`, `_debounce`, and `_prevData`. `_data` can be an object of generic type `T`, a `Model<T>` instance, or a function returning `T`. If `_data` is a `Model<T>`, it extracts the data; if it's a function, it calls the function to get the data; otherwise, it just assigns `_data`.
    - `setData`: Accepts a Partial `<T>` or a function returning a Partial `<T>` as parameter. If it's a function, it calls the function with `_prevData` as argument. It then merges the new data with the existing `_data` and triggers the `_change` method.
    - `handleChange`: Accepts a callback `change` that is invoked when there are changes in the Model. This method sets up several subscriptions and returns a cleanup function that unsubscribes everything.
    - `handleDropChanges`: Calls the `next` method of `_dropChanges`.
    - `refresh`: Triggers the `REFRESH_SYMBOL` event.
    - `toObject`: Returns the current data of the model.

The `Entity` class (shown in the "Related information" section) extends this `Model` class and seems to be a more specific implementation, possibly representing an Entity in the sense of a Database Entity or a business object with an ID and other properties. 

Although some external functions and symbols like `EventEmitter`, `CHANGE_SYMBOL`, `REFRESH_SYMBOL` etc. are used in this code, exact functionality details depend on their implementation.

The use of the observable pattern via `Subject`, `subscribe`, and `unsubscribe` allows the `Model` to work smoothly in reactive programming paradigms, making it easy to respond dynamically to changes in state.

The `IModelAdapter` interface used to implement the `Model` class ensures a contract that any model will have the methods `setData`, `refresh` and `toObject`. This interface can still be implemented by other classes representing different types of Models, hence promoting code reusability and consistency. 

Note: This class uses TypeScript features such as Generics (`T`), Type assertions (`as Function`), Intersection Types (`Partial<T>`), and Arrow Function Syntax. The usage of `Partial<T>` allows for flexibility in providing only some properties of a model object when setting data using the `setData` function.

