import React from 'react';

import { useCollection, Entity } from "react-declarative";

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
    </>
  );
};

export default App;
