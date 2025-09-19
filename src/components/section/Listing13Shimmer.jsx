import React from 'react';

// Add shimmer animation to document if not already added
if (typeof document !== 'undefined' && !document.querySelector('#shimmer-styles')) {
    const style = document.createElement('style');
    style.id = 'shimmer-styles';
    style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .shimmer-effect {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
  `;
    document.head.appendChild(style);
}

// Freelancer card shimmer component
const FreelancerCardShimmer = () => (
    <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="freelancer-style1 bdrs8 bdr1 mb-4">
            <div className="d-lg-flex">
                <div className="thumb w90 position-relative rounded-circle mb15-md">
                    <div className="shimmer-effect rounded-circle" style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
                <div className="details ml15 ml0-md">
                    <div className="shimmer-effect mb-2" style={{
                        height: '20px',
                        width: '150px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-2" style={{
                        height: '16px',
                        width: '120px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="d-flex align-items-center mb-2">
                        <div className="shimmer-effect me-2" style={{
                            width: '80px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                        <div className="shimmer-effect" style={{
                            width: '60px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                    </div>
                </div>
            </div>
            <div className="skill-tags d-flex align-items-center justify-content-start">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="shimmer-effect me-2 mb-2" style={{
                        width: `${60 + i * 10}px`,
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                ))}
            </div>
            <hr className="opacity-100" />
            <div className="d-flex align-items-center justify-content-between">
                <div className="shimmer-effect" style={{
                    width: '100px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
                <div className="shimmer-effect" style={{
                    width: '60px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
        </div>
    </div>
);

// Listing options shimmer (filters/sorting)
const ListingOptionsShimmer = () => (
    <div className="row align-items-center mb40">
        <div className="col-sm-6">
            <div className="text-center text-sm-start">
                <div className="shimmer-effect" style={{
                    height: '20px',
                    width: '200px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
        </div>
        <div className="col-sm-6">
            <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
                <div className="me-2">
                    <div className="shimmer-effect" style={{
                        height: '16px',
                        width: '60px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
                <div className="shimmer-effect" style={{
                    height: '40px',
                    width: '120px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
        </div>
    </div>
);

// Pagination shimmer
const PaginationShimmer = () => (
    <div className="row mt30">
        <div className="col-lg-12">
            <div className="mbp_pagination text-center">
                <div className="d-flex justify-content-center align-items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="shimmer-effect me-2" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function Listing13Shimmer({ skeletonCount = 12 }) {
    return (
        <section className="pt30 pb90">
            <div className="container">
                <ListingOptionsShimmer />
                <div className="row">
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <FreelancerCardShimmer key={i} />
                    ))}
                </div>
                <PaginationShimmer />
            </div>
        </section>
    );
}