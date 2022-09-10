import React from 'react';

import { useCollection, Entity } from "react-declarative";

const ListItem = ({ entity }: { entity: Entity }) => {
  const handleIncrement = () => {
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
  });

  const handleAdd = () => {
    collection.push({
      id: Math.max(...collection.ids as number[], 0) + 1,
      counter: 0
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
