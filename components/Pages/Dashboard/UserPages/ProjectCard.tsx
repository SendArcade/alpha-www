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
import { Trash2, ThumbsUp, ThumbsDown, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  text: string;
  userName: string;
  userImage?: string;
  createdAt: Date;
}

interface ProjectCardProps {
  project: Project & {
    user: {
      name: string | null;
      image: string | null;
    };
    likes?: number;
    dislikes?: number;
    comments?: Comment[];
  };
  onDelete?: () => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [likesCount, setLikesCount] = useState(project.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(project.dislikes || 0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const router = useRouter();

  // Format date as MM/DD/YYYY
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }
  );

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/projects/${project.id}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();

      // Convert API comment format to local format
      const formattedComments: Comment[] = data.map((comment: any) => ({
        id: comment.id,
        text: comment.content,
        userName: comment.user.name || "Anonymous",
        userImage: comment.user.image,
        createdAt: new Date(comment.createdAt),
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  }, [project.id]);

  // Fetch comments when dialog opens
  useEffect(() => {
    if (isCommentsDialogOpen) {
      fetchComments();
    }
  }, [isCommentsDialogOpen, fetchComments]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error(
            "Unauthorized: You don't have permission to delete this project"
          );
        } else {
          throw new Error(errorData.error || "Failed to delete project");
        }
      }
      toast.success("Project deleted successfully");
      setIsDeleteDialogOpen(false);
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the project"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
      if (disliked) {
        setDislikesCount(dislikesCount - 1);
      }
    }
    setLiked(!liked);
    if (disliked) setDisliked(false);
    // Here you would typically call an API to record the like
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disliked) {
      setDislikesCount(dislikesCount - 1);
    } else {
      setDislikesCount(dislikesCount + 1);
      if (liked) {
        setLikesCount(likesCount - 1);
      }
    }
    setDisliked(!disliked);
    if (liked) setLiked(false);
    // Here you would typically call an API to record the dislike
  };

  const handleCommentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentsDialogOpen(true);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const newCommentData = await response.json();

      // Convert API comment format to local format
      const commentToAdd: Comment = {
        id: newCommentData.id,
        text: newCommentData.content,
        userName: newCommentData.user.name || "Anonymous",
        userImage: newCommentData.user.image,
        createdAt: new Date(newCommentData.createdAt),
      };

      setComments([commentToAdd, ...comments]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while adding the comment"
      );
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="w-full max-w-[350px]">
        <Card className="bg-[#0a0118] border border-white/10 overflow-hidden hover:border-white/20 transition-all relative">
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
                  liked ? "text-green-500" : "text-gray-400"
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
                  disliked ? "text-red-500" : "text-gray-400"
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
                onClick={handleCommentToggle}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="ml-1">{comments.length}</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/projects/${project.id}`} passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-[#2A0E61] hover:bg-[#3a1e71] text-white border-none"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="p-1"
                onClick={(e) => {
                  stopPropagation(e);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0a0118] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete &quot;{project.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
      >
        <DialogContent className="bg-[#0a0118] border border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments on &quot;{project.title}&quot;
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-3 my-4 pr-2">
            {isLoadingComments ? (
              <div className="text-center py-8">
                <div className="animate-spin h-10 w-10 border-2 border-white/20 border-t-white rounded-full mx-auto mb-2"></div>
                <p className="text-gray-400">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#2A0E61] flex items-center justify-center overflow-hidden">
                      {comment.userImage ? (
                        <Image
                          src={comment.userImage}
                          alt={comment.userName}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs text-white">
                          {comment.userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 pl-8">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleAddComment} className="mt-2">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[80px] bg-[#1a0a2e] border-white/10 text-white mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-[#2A0E61] hover:bg-[#3a1e71]">
                Post Comment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
