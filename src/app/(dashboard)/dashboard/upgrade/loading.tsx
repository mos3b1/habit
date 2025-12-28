import { Skeleton } from "@/components/ui/skeleton";

export default function UpgradeLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}