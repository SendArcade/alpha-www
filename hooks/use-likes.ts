import { useState, useEffect } from "react";

interface UseLikesResult {
  likesCount: number;
  userLiked: boolean;
  isLoading: boolean;
  error: string | null;
  likeProject: () => Promise<void>;
  unlikeProject: () => Promise<void>;
}

export function useLikes(projectId: string): UseLikesResult {
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/likes`);
      if (!response.ok) {
        throw new Error("Failed to fetch likes");
      }
      const data = await response.json();
      setLikesCount(data.likesCount);
      setUserLiked(data.userLiked);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const likeProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like project");
      }

      // Optimistically update UI
      setUserLiked(true);
      setLikesCount((prev) => prev + 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Revert optimistic update if there was an error
      await fetchLikes();
    } finally {
      setIsLoading(false);
    }
  };

  const unlikeProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/likes`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unlike project");
      }

      // Optimistically update UI
      setUserLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Revert optimistic update if there was an error
      await fetchLikes();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [projectId]);

  return {
    likesCount,
    userLiked,
    isLoading,
    error,
    likeProject,
    unlikeProject,
  };
}
