import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, FolderGit2, UserCircle2 } from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  return (
    <div className="pb-12 bg-[#0a0118] text-white h-full w-64 border-r border-white/10">
      <div className="space-y-6 py-4">
        <div className="px-4 py-4">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-white/10"
            >
              <Link href="/dashboard/explore" className="text-xl">
                <Compass className="mr-2 h-8 w-8" />
                Explore
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-white/10"
            >
              <Link href="/dashboard/myproject" className="text-xl">
                <FolderGit2 className="mr-2 h-8 w-8" />
                My Project
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-white/10"
            >
              <Link href="/dashboard/profile" className="text-xl">
                <UserCircle2 className="mr-2 h-8 w-8" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
