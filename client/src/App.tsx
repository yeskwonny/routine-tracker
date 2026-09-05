import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { itemStore, type ItemType } from "./stores/ItemStore";
import { ItemCard } from "./components/ItemCard";
import { IconClipboardList, IconPlus } from "@tabler/icons-react";
import { AddItemModal } from "./components/AddItemModal";
import "./index.css";
import { Toast } from "./components/Toast";
import { getDaysRemaining } from "./helpers";

const App = observer(() => {
  useEffect(() => {
    itemStore.fetchItems();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleReplace = (id: string) => {
    const item = itemStore.items.find((i) => i.id === id);
    if (!item) return;

    itemStore.updateItem({
      id,
      name: item.name,
      cycleDays: item.cycleDays,
      lastReplacedAt: new Date().toISOString().split("T")[0],
    });

    setToast(`${item.name} marked as replaced`);
    setTimeout(() => setToast(null), 2000);
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

  const overdueCount = itemStore.items.filter(
    (item) => getDaysRemaining(item.cycleDays, item.lastReplacedAt) < 0,
  ).length;

  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="flex mb-1 justify-between items-center">
        <h1>Routine Tracker</h1>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700"
          onClick={handleAddClick}
        >
          <IconPlus size={18} className="text-white" />
        </button>
      </div>

      {itemStore.items.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          {itemStore.items.length} items
          {overdueCount > 0 && ` · ${overdueCount} overdue`}
        </p>
      )}

      {itemStore.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <IconClipboardList size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            No routines yet
          </p>
          <p className="text-xs text-gray-400 mb-4">
            The stuff you always forget to replace
          </p>
          <button
            onClick={handleAddClick}
            className="text-xs px-4 py-2 rounded-lg bg-gray-900 text-white font-medium"
          >
            Add your first item
          </button>
        </div>
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
      {toast && <Toast message={toast} />}
    </div>
  );
});

export default App;
