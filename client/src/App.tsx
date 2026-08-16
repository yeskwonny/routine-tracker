import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { itemStore } from "./stores/ItemStore";
import { ItemCard } from "./components/ItemCard";
import { IconPlus } from "@tabler/icons-react";
import { AddItemModal } from "./components/AddItemModal";
import "./index.css";

const App = observer(() => {
  useEffect(() => {
    itemStore.fetchItems();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReplace = (id: string) => {
    const item = itemStore.items.find((i) => i.id === id);
    if (!item) return;

    itemStore.updateItem({
      id,
      name: item.name,
      cycleDays: item.cycleDays,
      lastReplacedAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (id: string) => {
    const item = itemStore.items.find((i) => i.id === id);
    if (!item) return;

    itemStore.removeItem(id);
  };
  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="flex mb-2 justify-between items-center">
        <h1>Routine Tracker</h1>
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
          onClick={() => setIsModalOpen(true)}
        >
          <IconPlus size={14} />
        </button>
      </div>

      {itemStore.items.map((item) => (
        <ItemCard
          key={item.id}
          {...item}
          onReplace={handleReplace}
          onDelete={handleDelete}
        />
      ))}

      {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
});

export default App;
