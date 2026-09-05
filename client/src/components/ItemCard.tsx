import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { getDaysRemaining, getStatus } from "../helpers";

interface ItemCardProps {
  id: string;
  name: string;
  cycleDays: number;
  lastReplacedAt: string;
  onReplace: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  overdue: {
    Icon: IconAlertCircle,
    bg: "bg-red-100",
    iconColor: "text-red-800",
    textColor: "text-red-700",
    border: "border-red-300",
  },
  soon: {
    Icon: IconClock,
    bg: "bg-amber-100",
    iconColor: "text-amber-800",
    textColor: "text-gray-500",
    border: "border-gray-200",
  },
  ok: {
    Icon: IconCheck,
    bg: "bg-green-100",
    iconColor: "text-green-800",
    textColor: "text-gray-500",
    border: "border-gray-200",
  },
};

export const ItemCard = observer(
  ({
    id,
    name,
    cycleDays,
    lastReplacedAt,
    onReplace,
    onEdit,
    onDelete,
  }: ItemCardProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    //  handling more button
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysRemaining = getDaysRemaining(cycleDays, lastReplacedAt);
    const status = getStatus(daysRemaining);
    const { Icon, bg, iconColor, textColor, border } = statusConfig[status];

    const label =
      daysRemaining < 0 ? (
        `${Math.abs(daysRemaining)} days overdue`
      ) : (
        <>
          {daysRemaining} days left
          <br />
          every {cycleDays} days
        </>
      );
    return (
      <div
        className={`bg-white border ${border} rounded-xl p-4 flex items-center gap-3 relative mb-1`}
      >
        <div
          className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}
        >
          <Icon size={18} className={iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium m-0 truncate">{name}</p>
          <p className={`text-xs ${textColor} m-0`}>{label}</p>
        </div>

        <button
          onClick={() => onReplace(id)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 shrink-0"
        >
          Replace
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="More options"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 shrink-0"
          >
            <IconDots size={18} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-10">
              <button
                onClick={() => {
                  onEdit(id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <IconPencil size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <IconTrash size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);
