import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

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

interface ProjectCardProps {
  project: Project & {
    user: {
      name: string | null;
      image: string | null;
    };
    _count?: {
      likes: number;
      dislikes: number;
      comments: number;
    };
    userLiked?: boolean;
    userDisliked?: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Format date as MM/DD/YYYY
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }
  );

  // State for likes, dislikes, and comments
  const [likesCount, setLikesCount] = useState(project._count?.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(
    project._count?.dislikes || 0
  );
  const [commentsCount, setCommentsCount] = useState(
    project._count?.comments || 0
  );
  const [userLiked, setUserLiked] = useState(project.userLiked || false);
  const [userDisliked, setUserDisliked] = useState(
    project.userDisliked || false
  );

  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // State for comment dialog and new comment
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Fetch comments from the API
  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/projects/${project.id}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
      setCommentError(null);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoadingComments(false);
    }
  }, [project.id]);

  // Fetch comments when dialog opens
  useEffect(() => {
    if (isCommentDialogOpen) {
      fetchComments();
    }
  }, [isCommentDialogOpen, fetchComments]);

  // Handle like button click
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (userLiked) {
        // Unlike the project
        const response = await fetch(`/api/projects/${project.id}/likes`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUserLiked(false);
          setLikesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Like the project
        const response = await fetch(`/api/projects/${project.id}/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUserLiked(true);
          setLikesCount((prev) => prev + 1);

          // If user had disliked, remove the dislike
          if (userDisliked) {
            setUserDisliked(false);
            setDislikesCount((prev) => Math.max(0, prev - 1));
          }
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Handle dislike button click
  const handleDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (userDisliked) {
        // Remove dislike
        const response = await fetch(`/api/projects/${project.id}/dislikes`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUserDisliked(false);
          setDislikesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Dislike the project
        const response = await fetch(`/api/projects/${project.id}/dislikes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUserDisliked(true);
          setDislikesCount((prev) => prev + 1);

          // If user had liked, remove the like
          if (userLiked) {
            setUserLiked(false);
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
        }
      }
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  // Handle comment button click
  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentDialogOpen(true);
  };

  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await fetch(`/api/projects/${project.id}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment.trim() }),
        });

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const newCommentData = await response.json();
        setComments((prev) => [newCommentData, ...prev]);
        setCommentsCount((prev) => prev + 1);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-[350px]">
      <Card className="bg-[#0a0118] border border-white/10 overflow-hidden hover:border-white/20 transition-all">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={project.imageUrl || "/placeholder-game.jpg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
            {project.title.length > 30
              ? `Project Name with a long long long long long long name`
              : project.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-[#2A0E61] flex items-center justify-center overflow-hidden">
              {project.user.image ? (
                <Image
                  src={project.user.image}
                  alt={project.user.name || "Creator"}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-white">
                  {project.user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">Creator Name</span>
            <span className="text-sm text-gray-400 ml-auto">
              {formattedDate}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${
                userLiked ? "text-green-500" : "text-gray-400"
              } hover:text-green-500`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="ml-1">{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${
                userDisliked ? "text-red-500" : "text-gray-400"
              } hover:text-red-500`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-5 w-5" />
              <span className="ml-1">{dislikesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-blue-500"
              onClick={handleCommentClick}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="ml-1">{commentsCount}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="bg-[#0a0118] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-[#1a0b28] border-white/10 text-white"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-[#2A0E61] hover:bg-[#3a1e71] text-white"
                >
                  Post
                </Button>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-4">
              {isLoadingComments ? (
                <p className="text-center text-gray-400">Loading comments...</p>
              ) : commentError ? (
                <p className="text-center text-red-400">
                  Error loading comments: {commentError}
                </p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-400">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.image || undefined} />
                      <AvatarFallback className="bg-[#2A0E61] text-white">
                        {comment.user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {comment.user.name || "Anonymous"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
