import ShimmerLoader from "@/components/common/ShimmerLoader";

export default function FreelancerCardSkeleton() {
    return (
        <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
            <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
                <ShimmerLoader
                    width="90px"
                    height="90px"
                    borderRadius="50%"
                    className="mx-auto"
                />
            </div>
            <div className="details">
                {/* Name */}
                <div className="mb15">
                    <ShimmerLoader width="140px" height="18px" className="mx-auto" />
                </div>

                {/* Profession */}
                <div className="mb15">
                    <ShimmerLoader width="100px" height="14px" className="mx-auto" />
                </div>

                {/* Skills Tags */}
                <div className="d-flex align-items-center justify-content-center mb15" style={{ gap: '8px' }}>
                    <ShimmerLoader width="50px" height="22px" borderRadius="12px" />
                    <ShimmerLoader width="60px" height="22px" borderRadius="12px" />
                    <ShimmerLoader width="40px" height="22px" borderRadius="12px" />
                </div>

                <hr className="opacity-100 mt20 mb15" />

                {/* Meta Information */}
                <div className="fl-meta d-flex align-items-center justify-content-between mb15">
                    <div className="text-center">
                        <ShimmerLoader width="60px" height="12px" className="mb5" />
                        <ShimmerLoader width="50px" height="14px" />
                    </div>
                    <div className="text-center">
                        <ShimmerLoader width="40px" height="12px" className="mb5" />
                        <ShimmerLoader width="70px" height="14px" />
                    </div>
                    <div className="text-center">
                        <ShimmerLoader width="70px" height="12px" className="mb5" />
                        <ShimmerLoader width="40px" height="14px" />
                    </div>
                </div>

                {/* View Profile Button */}
                <div className="d-grid">
                    <ShimmerLoader width="100%" height="40px" borderRadius="6px" />
                </div>
            </div>
        </div>
    );
}