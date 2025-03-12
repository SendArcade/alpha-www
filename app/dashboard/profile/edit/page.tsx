"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setFormData({
          name: data.name || session?.user?.name || "",
          bio: data.bio || "",
          location: data.location || "",
          image: data.image || session?.user?.image || "",
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    if (session) {
      fetchUser();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      router.push("/dashboard/profile");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container  mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <Card className="w-[700px] mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            {formData.image && (
              <Image
                src={formData.image}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <label className="text-sm font-medium">Profile Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="Image URL"
                className="text-black"
              />
              <p className="text-sm text-gray-500 mt-1">
                Using profile image from {session?.user?.provider || "default"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              className="text-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Your location"
            />
          </div>

          <div className="flex  text-black justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
