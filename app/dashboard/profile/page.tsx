"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectCard } from "@/components/Pages/Dashboard/UserPages/ProjectCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserProjects } from "@/hooks/use-projects";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { data: projects, isLoading: projectsLoading } = useUserProjects(
    "",
    ""
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  if (!user || projectsLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button onClick={() => router.push("/dashboard/profile/edit")}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Profile Section */}
        <Card className="md:col-span-4 h-fit p-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={user.image || "/placeholder-avatar.jpg"}
                alt="Profile"
              />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="text-lg">{user.name || "Not set"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              <p className="text-lg">{user.bio || "No bio yet"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Location
              </h3>
              <p className="text-lg">{user.location || "Not set"}</p>
            </div>
          </div>
        </Card>

        {/* Projects Section */}
        <div className="md:col-span-8 h-full">
          <Card className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects?.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {projects?.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-8">
                  No projects yet
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
