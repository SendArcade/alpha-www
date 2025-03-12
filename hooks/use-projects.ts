import { useQuery } from "@tanstack/react-query";
import { Project } from "@prisma/client";

// Define the Project type with user information
export type ProjectWithUser = Project & {
  user: {
    name: string | null;
    image: string | null;
  };
};

// Hook to fetch public projects
export function usePublicProjects(searchQuery: string, category: string) {
  return useQuery({
    queryKey: ["public-projects", searchQuery, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (category && category !== "all") params.append("category", category);

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });
}

// Hook to fetch recent public projects
export function useRecentPublicProjects() {
  return useQuery({
    queryKey: ["recent-public-projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects/public");
      if (!response.ok)
        throw new Error("Failed to fetch recent public projects");
      return response.json();
    },
  });
}

// Hook to fetch user's projects (both private and public)
export function useUserProjects(searchQuery: string, category: string) {
  return useQuery({
    queryKey: ["user-projects", searchQuery, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (category && category !== "all") params.append("category", category);

      const response = await fetch(`/api/user/projects?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch user projects");
      return response.json();
    },
  });
}

// Hook to fetch a single project
export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      return response.json() as Promise<ProjectWithUser>;
    },
    enabled: !!projectId, // Only fetch when projectId is available
  });
}

// Hook to fetch private projects for the authenticated user
export function usePrivateProjects() {
  return useQuery({
    queryKey: ["private-projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects/private");
      if (!response.ok) throw new Error("Failed to fetch private projects");
      return response.json() as Promise<ProjectWithUser[]>;
    },
  });
}
