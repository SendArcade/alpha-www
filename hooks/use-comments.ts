import { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface UseCommentsResult {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

export function useComments(projectId: string): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshComments = async () => {
    await fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    refreshComments,
  };
}
