"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, FolderGit2, UserCircle2 } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  // Create a function to determine if a route is active
  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  // Function to generate class names based on active state
  const getLinkClassName = (path: string) => {
    return `text-xl flex items-center ${
      isActive(path)
        ? "bg-white/10 rounded-md font-medium text-white"
        : "text-white/70 hover:text-white hover:bg-white/5 rounded-md"
    } px-3 py-2 transition-colors`;
  };

  return (
    <div className="pb-12 bg-[#0a0118] text-white h-full w-64 border-r border-white/10">
      <div className="space-y-6 py-4">
        <div className="px-4 py-2">
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/explore"
              className={getLinkClassName("/dashboard/explore")}
            >
              <Compass className="mr-2 h-6 w-6" />
              Explore
            </Link>

            <Link
              href="/dashboard/myproject"
              className={getLinkClassName("/dashboard/myproject")}
            >
              <FolderGit2 className="mr-2 h-6 w-6" />
              My Project
            </Link>

            <Link
              href="/dashboard/profile"
              className={getLinkClassName("/dashboard/profile")}
            >
              <UserCircle2 className="mr-2 h-6 w-6" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
