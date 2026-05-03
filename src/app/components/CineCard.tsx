import { CineItem } from "../models/cine-item";
import { Status } from "../types/status";

interface CineCardProps {
  item: CineItem;
  deleteItem: (id: number) => void;
  updateStatus: (id: number, status: Status) => void;
}

export default function CineCard({
  item,
  deleteItem,
  updateStatus,
}: CineCardProps) {
  return (
    <div key={item.id} className="bg-white p-4 rounded-md shadow-md">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-bold">{item.title}</h2>
        <button
          className="p-2 rounded-md bg-red-500 text-white shadow-md cursor-pointer hover:bg-red-600"
          onClick={() => deleteItem(item.id)}
        >
          Delete
        </button>
      </div>
      <p>
        Type: <b>{item.type}</b>
      </p>
      <p>
        Statut: <b>{item.status}</b>
      </p>
      <p>
        Note: <b>{item.rating}</b>
      </p>
      <p>
        Création: <b>{item.createdAt.toLocaleDateString()}</b>
      </p>
      <p>
        Mise à jour: <b>{item.updatedAt.toLocaleDateString()}</b>
      </p>

      <div className="flex flex-row gap-2 mt-8 items-center">
        <label htmlFor="status" className="text-sm font-bold">
          Status
        </label>
        <select
          id="status"
          className="p-0.5 rounded-md border border-gray-300"
          onChange={(e) => updateStatus(item.id, e.target.value as Status)}
        >
          <option value="to-watch">To Watch</option>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
