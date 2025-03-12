import { useState, useEffect } from "react";

interface UseDislikesResult {
  dislikesCount: number;
  userDisliked: boolean;
  isLoading: boolean;
  error: string | null;
  dislikeProject: () => Promise<void>;
  removeDislike: () => Promise<void>;
}

export function useDislikes(projectId: string): UseDislikesResult {
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userDisliked, setUserDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDislikes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/dislikes`);
      if (!response.ok) {
        throw new Error("Failed to fetch dislikes");
      }
      const data = await response.json();
      setDislikesCount(data.dislikesCount);
      setUserDisliked(data.userDisliked);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const dislikeProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/dislikes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to dislike project");
      }

      // Optimistically update UI
      setUserDisliked(true);
      setDislikesCount((prev) => prev + 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Revert optimistic update if there was an error
      await fetchDislikes();
    } finally {
      setIsLoading(false);
    }
  };

  const removeDislike = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/dislikes`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove dislike");
      }

      // Optimistically update UI
      setUserDisliked(false);
      setDislikesCount((prev) => Math.max(0, prev - 1));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Revert optimistic update if there was an error
      await fetchDislikes();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDislikes();
  }, [projectId]);

  return {
    dislikesCount,
    userDisliked,
    isLoading,
    error,
    dislikeProject,
    removeDislike,
  };
}
