import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface SearchAndFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: (category: string) => void;
}

export function SearchAndFilter({ onSearch, onFilter }: SearchAndFilterProps) {
  return (
    <div className="flex items-center gap-4 w-full max-w-3xl">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Project"
          className="w-full py-2 pl-10 pr-4 bg-[#0a0118] border border-white/10 rounded-full text-white focus:outline-none focus:border-white/30"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#0a0118] border border-white/10 text-white rounded-full flex items-center gap-2"
          >
            Filter by category
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#0a0118] border border-white/10 text-white">
          <DropdownMenuItem onClick={() => onFilter && onFilter("all")}>
            All Categories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilter && onFilter("games")}>
            Games
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilter && onFilter("apps")}>
            Apps
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilter && onFilter("tools")}>
            Tools
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
