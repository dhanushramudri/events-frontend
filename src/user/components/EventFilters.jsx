import React from "react";
import { Button } from "../../admin/components/ui/button";
import { Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../admin/components/ui/select";

const EventFilters = ({ filter, setFilter, showFavoritesOnly, setShowFavoritesOnly }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="w-40">
        <Select
          value={filter.category}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Conference">Conference</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Seminar">Seminar</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-40">
        <Select
          value={filter.date}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, date: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</ SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-40">
        <Select
          value={filter.sortBy}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, sortBy: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (Newest)</SelectItem>
            <SelectItem value="dateAsc">Date (Oldest)</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        onClick={() => setShowFavoritesOnly((prev) => !prev)}
        className="flex items-center gap-1"
      >
        <Heart
          className={`w-4 h-4 ${
            showFavoritesOnly ? "fill-white text-white" : ""
          }`}
        />
        {showFavoritesOnly ? "All Events" : "Favorites"}
      </Button>
    </div>
  );
};

export default EventFilters;