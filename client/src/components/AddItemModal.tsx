import { useState } from "react";
import { observer } from "mobx-react-lite";
import { IconX } from "@tabler/icons-react";
import { itemStore, type ItemType } from "../stores/ItemStore";

import { Spinner } from "./Spinner";

interface AddItemModalProps {
  onClose: () => void;
  editingItem: ItemType | null;
}
export const AddItemModal = observer(
  ({ onClose, editingItem }: AddItemModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const close = () => {
      if (!isSubmitting) onClose();
    };
    const isEditMode = !!editingItem;

    const [name, setName] = useState(editingItem?.name ?? "");
    const [cycleDays, setCycleDays] = useState(
      editingItem?.cycleDays.toString() ?? "",
    );
    const [lastReplacedAt, setLastReplacedAt] = useState(
      editingItem?.lastReplacedAt ?? new Date().toISOString().split("T")[0],
    );

    const handleSubmit = async () => {
      if (!name || !cycleDays || isSubmitting) return;
      setIsSubmitting(true);
      setError(null);
      try {
        if (isEditMode) {
          await itemStore.updateItem({
            id: editingItem.id,
            name,
            cycleDays: Number(cycleDays),
            lastReplacedAt,
          });
        } else {
          await itemStore.addItem({
            name,
            cycleDays: Number(cycleDays),
            lastReplacedAt,
          });
        }

        onClose();
      } catch {
        setError("Could not save the item. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
        onClick={close}
      >
        <div
          className="bg-white rounded-2xl p-6 w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-medium m-0">Add item</p>
            <button
              onClick={close}
              disabled={isSubmitting}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <IconX size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Toothbrush head"
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm transition-shadow"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1.5">
                Replace every (days)
              </label>
              <input
                type="number"
                placeholder="90"
                disabled={isSubmitting}
                value={cycleDays}
                onChange={(e) => setCycleDays(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm transition-shadow"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1.5">
                Last replaced
              </label>
              <input
                type="date"
                disabled={isSubmitting}
                value={lastReplacedAt}
                onChange={(e) => setLastReplacedAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm transition-shadow"
              />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}
          <div className="flex gap-2 mt-5">
            <button
              onClick={close}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 disabled:opacity-60 bg-gray-900 text-white rounded-lg py-2 text-sm"
            >
              {isSubmitting && <Spinner inline />}
              {isSubmitting ? "Saving…" : isEditMode ? "Save changes" : "Add item"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
