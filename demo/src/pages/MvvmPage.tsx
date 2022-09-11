import React from 'react';

import { useCollection, useModel, Entity } from "react-declarative";

const ListItem = ({ entity }: { entity: Entity }) => {
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
  });

  const handleIncrement = () => {
    model.setData({
      counter: model.data.counter + 1,
    });
    model.refresh()
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
  });

  const handleAdd = () => {
    /*
    const { id, ...data } = await fetch("/api/v1/counters/create", {
      method: "POST",
    }).then((data) => data.json());
    */
    collection.push({
      id: Math.max(...collection.ids as number[], 0) + 1,
      counter: 0,
      // ...data
    });
  };

  return (
    <>
      {collection.map((entity) => (
        <ListItem key={entity.id} entity={entity} />
      ))}
      <button onClick={handleAdd}>Add item</button>
      <br />
      <ItemModel />
    </>
  );
};

export default App;
