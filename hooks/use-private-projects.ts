import { useQuery } from "@tanstack/react-query";
import { Project } from "@prisma/client";

// Define the Project type with user information
export type ProjectWithUser = Project & {
  user: {
    name: string | null;
    image: string | null;
  };
};

export function usePrivateProjects(searchQuery?: string, category?: string) {
  return useQuery({
    queryKey: ["private-projects", searchQuery, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (category && category !== "all") params.append("category", category);

      const response = await fetch(`/api/user/projects?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch private projects");
      return response.json() as Promise<ProjectWithUser[]>;
    },
  });
}

// Hook to fetch a single private project
export function usePrivateProject(projectId: string) {
  return useQuery({
    queryKey: ["private-project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/user/projects/${projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch private project");
      }
      return response.json() as Promise<ProjectWithUser>;
    },
    enabled: !!projectId, // Only fetch when projectId is available
  });
}
