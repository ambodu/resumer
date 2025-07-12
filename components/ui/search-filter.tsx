"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: {
    key: string;
    label: string;
    active: boolean;
  }[];
  onFilterToggle: (key: string) => void;
  onClearFilters: () => void;
  placeholder?: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters,
  onFilterToggle,
  onClearFilters,
  placeholder = "搜索..."
}: SearchFilterProps) {
  const activeFilters = filters.filter(f => f.active);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              筛选
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {filters.map((filter) => (
              <DropdownMenuItem
                key={filter.key}
                onClick={() => onFilterToggle(filter.key)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border ${
                    filter.active 
                      ? "bg-blue-600 border-blue-600" 
                      : "border-gray-300"
                  }`}>
                    {filter.active && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  {filter.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters */}
        {activeFilters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="cursor-pointer hover:bg-gray-200"
            onClick={() => onFilterToggle(filter.key)}
          >
            {filter.label}
            <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}

        {/* Clear All */}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            清除筛选
          </Button>
        )}
      </div>
    </div>
  );
}