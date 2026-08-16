import { observer } from "mobx-react-lite";
import {
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react";
import { getDaysRemaining, getStatus } from "../helpers";

interface ItemCardProps {
  id: string;
  name: string;
  cycleDays: number;
  lastReplacedAt: string;
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  overdue: { Icon: IconAlertCircle, bg: "bg-red-100", color: "text-red-800" },
  soon: { Icon: IconClock, bg: "bg-amber-100", color: "text-amber-800" },
  ok: { Icon: IconCheck, bg: "bg-green-100", color: "text-green-800" },
};

export const ItemCard = observer(
  ({
    id,
    name,
    cycleDays,
    lastReplacedAt,
    onReplace,
    onDelete,
  }: ItemCardProps) => {
    const daysRemaining = getDaysRemaining(cycleDays, lastReplacedAt);
    const status = getStatus(daysRemaining);
    const { Icon, bg, color } = statusConfig[status];

    const label =
      daysRemaining < 0
        ? `${Math.abs(daysRemaining)} days overdue`
        : daysRemaining === 0
          ? "Due today"
          : `${daysRemaining} days left`;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}
        >
          <Icon size={18} className={color} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium m-0">{name}</p>
          <p className="text-xs text-gray-500 m-0">
            {label} · Every {cycleDays} days
          </p>
        </div>

        <button
          onClick={() => onReplace(id)}
          className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Replace
        </button>
        {/* !todo modify modal to accept if it is edit mode or add mode */}
        <button
          onClick={() => {}}
          aria-label="Edit item"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 shrink-0"
        >
          <IconPencil size={16} className="text-gray-400" />
        </button>

        <button
          onClick={() => onDelete(id)}
          aria-label="Delete item"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 shrink-0"
        >
          <IconTrash size={16} className="text-gray-400 hover:text-red-600" />
        </button>
      </div>
    );
  },
);
