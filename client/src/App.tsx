import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { itemStore, type ItemType } from "./stores/ItemStore";
import { ItemCard } from "./components/ItemCard";
import { IconPlus } from "@tabler/icons-react";
import { AddItemModal } from "./components/AddItemModal";
import "./index.css";

const App = observer(() => {
  useEffect(() => {
    itemStore.fetchItems();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);

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

  const handleEdit = (id: string) => {
    const item = itemStore.items.find((i) => i.id === id);
    if (!item) return;
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = itemStore.items.find((i) => i.id === id);
    if (!item) return;

    itemStore.removeItem(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="flex mb-2 justify-between items-center">
        <h1>Routine Tracker</h1>
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
          onClick={handleAddClick}
        >
          <IconPlus size={14} />
        </button>
      </div>
      {itemStore.items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          Add your first routine
        </p>
      ) : (
        itemStore.items.map((item) => (
          <ItemCard
            key={item.id}
            {...item}
            onReplace={handleReplace}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}
      {isModalOpen && (
        <AddItemModal editingItem={editingItem} onClose={handleCloseModal} />
      )}
    </div>
  );
});

export default App;
