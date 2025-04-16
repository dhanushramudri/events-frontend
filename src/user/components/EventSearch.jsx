import React from "react";
import { Search } from "lucide-react";
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
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default EventSearch;