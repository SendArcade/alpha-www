"use client";

import { ProjectCard } from "@/components/Pages/Dashboard/UserPages/ProjectCard";
import { MyProjectNavbar } from "@/components/Pages/Dashboard/UserPages/MyProjectNavbar";
import { useCallback, useState } from "react";
import { useUserProjects } from "@/hooks/use-projects";

export default function ExploreProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: projects, isLoading } = useUserProjects(
    searchQuery,
    selectedCategory || ""
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Projects</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your projects
          </p>
        </div>
      </div>

      <MyProjectNavbar
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Skeleton loading state
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg h-[400px] w-[350px] border bg-card text-card-foreground shadow-sm animate-pulse"
              >
                <div className="h-48 rounded-t-lg bg-accent/10" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-2/3 bg-accent/10 rounded" />
                  <div className="h-4 w-full bg-accent/10 rounded" />
                  <div className="h-4 w-1/2 bg-accent/10 rounded" />
                </div>
              </div>
            ))}
          </>
        ) : projects?.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="text-lg text-muted-foreground">No projects found</p>
          </div>
        ) : (
          projects?.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
