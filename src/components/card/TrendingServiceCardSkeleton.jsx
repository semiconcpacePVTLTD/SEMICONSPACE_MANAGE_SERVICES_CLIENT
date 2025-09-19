import ShimmerLoader from "@/components/common/ShimmerLoader";

export default function TrendingServiceCardSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col">
            {/* Thumbnail */}
            <div className="relative w-full h-40 mb-3">
                <ShimmerLoader
                    width="100%"
                    height="160px"
                    borderRadius="8px"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                {/* Title */}
                <div className="mb-1">
                    <ShimmerLoader width="90%" height="20px" className="mb-1" />
                    <ShimmerLoader width="70%" height="20px" />
                </div>

                {/* Category description */}
                <div className="mb-3" style={{ minHeight: '2.5rem' }}>
                    <ShimmerLoader width="100%" height="14px" className="mb-1" />
                    <ShimmerLoader width="85%" height="14px" className="mb-1" />
                    <ShimmerLoader width="60%" height="14px" />
                </div>

                {/* Price + Button */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <ShimmerLoader width="80px" height="14px" className="mb-1" />
                        <ShimmerLoader width="60px" height="16px" />
                    </div>
                    <ShimmerLoader width="80px" height="32px" borderRadius="8px" />
                </div>
            </div>
        </div>
    );
}