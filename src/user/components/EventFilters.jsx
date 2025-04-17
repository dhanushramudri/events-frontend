import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const EventFilters = ({ filter, setFilter }) => {
  useEffect(() => {
    console.log("Current Filter: ", filter);
  }, [filter]);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Category Dropdown */}
      <div className="w-40">
        <Select
          value={filter.category}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="border border-[#19105b] text-[#19105b] focus:border-[#4f2a7f] focus:outline-none rounded-md py-2 px-4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#19105b] shadow-md rounded-md">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Conference">Conference</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Seminar">Seminar</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Dropdown */}
      <div className="w-40">
        <Select
          value={filter.status}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className="border border-[#19105b] text-[#19105b] focus:border-[#4f2a7f] focus:outline-none rounded-md py-2 px-4">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#19105b] shadow-md rounded-md">
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventFilters;
