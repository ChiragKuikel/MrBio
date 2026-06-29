interface VerticalProductShowCaseSkeletonProps {
  count?: number;
  title?: string;
  showViewMore?: boolean;
}

export const VerticalProductShowCaseSkeleton = ({
  count = 8,
  // title = "Loading Products",
  showViewMore = false,
}: VerticalProductShowCaseSkeletonProps) => {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          {showViewMore && (
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="w-full h-52 bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
