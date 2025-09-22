import ShimmerLoader from "@/components/common/ShimmerLoader";

export default function ListingOptionSkeleton() {
    return (
        <div className="row align-items-center mb20">
            <div className="col-sm-6 col-lg-9">
                <div className="text-center text-sm-start">
                    <div className="dropdown-lists">
                        <ul className="p-0 mb-0 text-center text-sm-start">
                            <li className="d-block d-xl-none mb-2">
                                <ShimmerLoader width="100px" height="40px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block me-3">
                                <ShimmerLoader width="60px" height="36px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block me-3">
                                <ShimmerLoader width="70px" height="36px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block me-3">
                                <ShimmerLoader width="80px" height="36px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block me-3">
                                <ShimmerLoader width="60px" height="36px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block me-3">
                                <ShimmerLoader width="90px" height="36px" borderRadius="4px" />
                            </li>

                            <li className="list-inline-item position-relative d-none d-xl-inline-block">
                                <ShimmerLoader width="80px" height="36px" borderRadius="4px" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}