import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const project = await db.project.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id);

  return (
    <div className="container text-white mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {project.user.image && (
            <Image
              src={project.user.image}
              alt={project.user.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">
              by {project.user.name} •{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Scratch Project Embed */}
        <div className="mb-8">
          <iframe
            src="https://scratch.mit.edu/projects/830033850/embed"
            allowTransparency={true}
            width="485"
            height="402"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="mx-auto rounded-lg"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <span className="text-sm  px-3 py-1 bg-primary/10 rounded-full">
            {project.category}
          </span>
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
