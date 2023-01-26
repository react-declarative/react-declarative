import React from 'react';

import { useCollection, useModel, IEntityAdapter, compose } from "react-declarative";

const ListItem = ({ entity }: { entity: IEntityAdapter }) => {
  const handleIncrement = () => {
    /*
    await fetch(`/api/v1/counters/${entity.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        counter: entity.data.counter + 1
      })
    });
    */
    entity.setData({
      id: entity.id,
      counter: entity.data.counter + 1
    });
  };

  return (
    <div key={entity.id}>
      {entity.data.counter}
      <button onClick={handleIncrement}>Increment counter</button>
    </div>
  );
};

const ItemModel = () => {

  const model = useModel({
    initialValue: () => ({
      counter: 0,
    }),
    onChange: (model) => console.log({
      model,
    }),
    debounce: 100,
  });

  const handleIncrement = () => {
    model.setData({
      counter: model.data.counter + 1,
    });
    // model.refresh()
  };

  return (
    <button onClick={handleIncrement}>
      {`Item without ID ${model.data.counter}`}
    </button>
  )
}

export const App = () => {
  const collection = useCollection({
    onChange: (collection, target) => console.log({
      collection,
      target,
    }),
    initialValue: [], // await fetch()
    // debounce: 10_000,
  });

  const handleAdd = () => {
    /*
    const { id, ...data } = await fetch("/api/v1/counters/create", {
      method: "POST",
    }).then((data) => data.json());
    */
    collection.push({
      id: collection.lastIdx,
      counter: 0,
      // ...data
    });
  };

  const handleUpsert = () => {
    const updateItems = collection.items.map(({ data }) => ({
      ...data,
      counter: data.counter + 1,
    }));
    const pendingItems = [
      { counter: 1 },
      { counter: 2 },
      { counter: 3 },
    ];
    collection.upsert([
      ...updateItems,
      ...pendingItems,
    ]);
  };

  return (
    <>
      {collection.map((entity) => (
        <ListItem key={entity.id} entity={entity} />
      ))}
      <button onClick={handleAdd}>Add item</button>
      <button onClick={handleUpsert}>Upsert items</button>
      <br />
      <ItemModel />
    </>
  );
};

export default App;
