import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        </div>
        <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        <Skeleton className="h-4 w-20 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
