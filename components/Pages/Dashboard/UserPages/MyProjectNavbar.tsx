"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, X, Filter } from "lucide-react";
import { useState } from "react";
import { CreateProjectModal } from "../CreateProjectModal";
import { useDebouncedCallback } from "use-debounce";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MyProjectNavbarProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
}

export function MyProjectNavbar({
  onSearch,
  onCategoryChange,
}: MyProjectNavbarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between gap-4 bg-gray-900/40 p-5 rounded-xl border border-gray-800/60 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-10 py-2 text-white bg-gray-800/80 border-gray-700/50 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 rounded-lg shadow-inner shadow-black/20 transition-all"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <Select value={activeCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px] text-white bg-gray-800/80 border-gray-700/50 focus:ring-1 focus:ring-blue-500/30 rounded-lg shadow-inner shadow-black/20">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white rounded-lg">
                <SelectItem
                  value="all"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  All Projects
                </SelectItem>
                <SelectItem
                  value="defi"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  DeFi
                </SelectItem>
                <SelectItem
                  value="game"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  Game
                </SelectItem>
                <SelectItem
                  value="nft"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  NFT
                </SelectItem>
                <SelectItem
                  value="dao"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  DAO
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Create Project Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md shadow-blue-900/20 transition-all duration-300 border-0"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-gray-800 text-white border-gray-700"
            >
              <p>Create a new Solana project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CreateProjectModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      </div>
    </div>
  );
}
