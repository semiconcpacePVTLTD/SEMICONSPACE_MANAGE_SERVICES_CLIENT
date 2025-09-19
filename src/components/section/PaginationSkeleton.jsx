import ShimmerLoader from "@/components/common/ShimmerLoader";

export default function PaginationSkeleton() {
    return (
        <div className="row mt30">
            <div className="col-lg-12">
                <nav className="d-flex justify-content-center align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <ShimmerLoader width="40px" height="40px" borderRadius="4px" />
                        <ShimmerLoader width="40px" height="40px" borderRadius="4px" />
                        <ShimmerLoader width="40px" height="40px" borderRadius="4px" />
                        <ShimmerLoader width="40px" height="40px" borderRadius="4px" />
                        <ShimmerLoader width="40px" height="40px" borderRadius="4px" />
                    </div>
                </nav>
            </div>
        </div>
    );
}