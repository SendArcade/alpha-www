"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  PlusCircle,
  Image as ImageIcon,
  FileText,
  Tag,
  Lock,
  Unlock,
  X,
  Sparkles,
} from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Game", // Default category
    private: false, // Default to public
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!session?.user?.email) {
      console.error("No user session found");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userEmail: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      onOpenChange(false);
      router.refresh();
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        category: "Game",
        private: false,
      });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryIcons: Record<string, JSX.Element> = {
    Game: <Badge variant="secondary">Game</Badge>,
    Web: <Badge variant="success">Web</Badge>,
    Mobile: <Badge variant="warning">Mobile</Badge>,
    Desktop: <Badge variant="default">Desktop</Badge>,
    Other: <Badge variant="outline">Other</Badge>,
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-gradient-to-br from-black/90 to-gray-900/90 border border-white/10 backdrop-blur-xl">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <DialogTitle className="text-xl font-bold text-white">
              Create New Project
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/70">
            Fill in the details below to create your new project
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-white/80 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              Project Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter a descriptive title"
              required
              className="border-white/10 bg-white/5 focus:border-blue-500/50 text-white focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-white/80 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your project"
              required
              className="min-h-[100px] text-white border-white/10 bg-white/5 focus:border-blue-500/50 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="imageUrl"
              className="text-white/80 flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4 text-blue-400" />
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="URL for project thumbnail"
              required
              className="border-white/10 bg-white/5 text-white focus:border-blue-500/50 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-white/80 flex items-center gap-2"
            >
              <Tag className="h-4 w-4 text-blue-400" />
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="border-white/10 bg-white/5 focus:border-blue-500/50 focus:ring-blue-500/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="Game" className="focus:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    {categoryIcons.Game}
                    <span>Game</span>
                  </div>
                </SelectItem>
                <SelectItem value="Web" className="focus:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    {categoryIcons.Web}
                    <span>Web</span>
                  </div>
                </SelectItem>
                <SelectItem value="Mobile" className="focus:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    {categoryIcons.Mobile}
                    <span>Mobile</span>
                  </div>
                </SelectItem>
                <SelectItem value="Desktop" className="focus:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    {categoryIcons.Desktop}
                    <span>Desktop</span>
                  </div>
                </SelectItem>
                <SelectItem value="Other" className="focus:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    {categoryIcons.Other}
                    <span>Other</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              {formData.private ? (
                <Lock className="h-4 w-4 text-amber-400" />
              ) : (
                <Unlock className="h-4 w-4 text-green-400" />
              )}
              <Label htmlFor="private" className="text-white/80 cursor-pointer">
                Make project private
              </Label>
            </div>
            <div className="flex-grow"></div>
            <Switch
              id="private"
              checked={formData.private}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, private: checked })
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2"
              disabled={isSubmitting}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
