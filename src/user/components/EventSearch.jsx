import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../../admin/components/ui/input";

const EventSearch = ({ filter, setFilter }) => {
  return (
    <div className="flex-1 w-full md:max-w-md mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search by event name or location..."
          value={filter.searchQuery}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              searchQuery: e.target.value,
            }))
          }
          className="pl-10 pr-3 py-2 rounded-lg border border-[#19105b] focus:ring-2 focus:ring-[#19105b] focus:outline-none transition-all"
        />
        {filter.searchQuery && (
          <button
            onClick={() => setFilter((prev) => ({ ...prev, searchQuery: "" }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#19105b] hover:text-[#4f2a7f] cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventSearch;
