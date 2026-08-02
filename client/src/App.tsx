import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { itemStore } from "./Stores/ItemStore";

const App = observer(() => {
  useEffect(() => {
    itemStore.fetchItems();
  }, []);

  if (itemStore.isLoading) return <p>로딩 중...</p>;

  return (
    <div>
      {itemStore.items.map((item) => (
        <li key={item.id}>
          {item.name} — {item.cycleDays}일
        </li>
      ))}
    </div>
  );
});

export default App;
