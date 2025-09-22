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

// Education timeline shimmer component
const EducationTimelineShimmer = () => (
    <div className="educational-quality timeline">
        {[1, 2].map((i) => (
            <div key={i} className={`timeline-item ${i === 1 ? "before-none" : ""}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="shimmer-effect mb-2" style={{
                        height: '16px',
                        width: '100px',
                        borderRadius: '12px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-2" style={{
                        height: '20px',
                        width: '200px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-3" style={{
                        height: '16px',
                        width: '150px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '40px',
                        width: '90%',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Work experience shimmer component
const WorkExperienceShimmer = () => (
    <div className="work-experience timeline">
        {[1, 2, 3].map((i) => (
            <div key={i} className={`timeline-item ${i === 1 ? "before-none" : ""}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="shimmer-effect mb-2" style={{
                        height: '16px',
                        width: '120px',
                        borderRadius: '12px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-2" style={{
                        height: '20px',
                        width: '180px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-3" style={{
                        height: '16px',
                        width: '140px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '60px',
                        width: '95%',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Awards shimmer component
const AwardsShimmer = () => (
    <div className="awards-wrapper">
        {[1, 2].map((i) => (
            <div key={i} className="d-flex align-items-start mb-4">
                <div className="shimmer-effect rounded me-3" style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f0f0f0'
                }}></div>
                <div className="flex-grow-1">
                    <div className="shimmer-effect mb-2" style={{
                        height: '18px',
                        width: '160px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect mb-2" style={{
                        height: '14px',
                        width: '100px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '32px',
                        width: '90%',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Skills shimmer component
const SkillsShimmer = () => (
    <div className="row">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="col-sm-6 col-lg-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="shimmer-effect" style={{
                        height: '16px',
                        width: '80px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '16px',
                        width: '30px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
                <div className="skill-progressbar">
                    <div className="shimmer-effect" style={{
                        height: '6px',
                        width: '100%',
                        borderRadius: '3px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Reviews shimmer component
const ReviewsShimmer = () => (
    <div>
        {[1, 2, 3].map((i) => (
            <div key={i} className="mb40">
                <div className="d-flex mb20">
                    <div className="shimmer-effect rounded-circle me-3" style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="flex-grow-1">
                        <div className="shimmer-effect mb-2" style={{
                            height: '18px',
                            width: '140px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                        <div className="d-flex align-items-center mb-2">
                            <div className="shimmer-effect me-2" style={{
                                height: '16px',
                                width: '100px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <div className="shimmer-effect" style={{
                                height: '16px',
                                width: '80px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                        </div>
                    </div>
                </div>
                <div className="shimmer-effect" style={{
                    height: '60px',
                    width: '95%',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
        ))}
    </div>
);

export default function FreelancerDetail1Shimmer() {
    return (
        <section className="pt10 pb90 pb30-md">
            <div className="container">
                <div className="row wow fadeInUp">
                    <div className="col-lg-8">
                        {/* Description section */}
                        <div className="service-about">
                            <div className="shimmer-effect mb-3" style={{
                                height: '28px',
                                width: '120px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <div className="shimmer-effect mb-4" style={{
                                height: '80px',
                                width: '100%',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>

                            <hr className="opacity-100 mb60 mt60" />

                            {/* Education section */}
                            <div className="shimmer-effect mb30" style={{
                                height: '28px',
                                width: '100px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <EducationTimelineShimmer />

                            <hr className="opacity-100 mb60 mt60" />

                            {/* Work Experience section */}
                            <div className="shimmer-effect mb30" style={{
                                height: '28px',
                                width: '150px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <WorkExperienceShimmer />

                            <hr className="opacity-100 mb60 mt60" />

                            {/* Awards section */}
                            <div className="shimmer-effect mb30" style={{
                                height: '28px',
                                width: '80px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <AwardsShimmer />

                            <hr className="opacity-100 mb60 mt60" />

                            {/* Skills section */}
                            <div className="shimmer-effect mb30" style={{
                                height: '28px',
                                width: '60px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <SkillsShimmer />

                            <hr className="opacity-100 mb60 mt60" />

                            {/* Reviews section */}
                            <div className="bsp-reveiw-content">
                                <div className="shimmer-effect mb30" style={{
                                    height: '28px',
                                    width: '100px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>
                                <ReviewsShimmer />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="column">
                            <div className="blog-sidebar ms-lg-auto">
                                {/* Contact widget shimmer */}
                                <div className="price-widget pt25 bdrs8">
                                    <div className="shimmer-effect mb-3" style={{
                                        height: '24px',
                                        width: '150px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                    <div className="shimmer-effect mb-4" style={{
                                        height: '40px',
                                        width: '100%',
                                        borderRadius: '8px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                    <div className="shimmer-effect mb-3" style={{
                                        height: '45px',
                                        width: '100%',
                                        borderRadius: '8px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                </div>

                                {/* Similar freelancers shimmer */}
                                <div className="blog-sidebar-widget mb30">
                                    <div className="shimmer-effect mb20" style={{
                                        height: '24px',
                                        width: '180px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="d-flex align-items-center mb-3">
                                            <div className="shimmer-effect rounded-circle me-3" style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                            <div className="flex-grow-1">
                                                <div className="shimmer-effect mb-1" style={{
                                                    height: '16px',
                                                    width: '120px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                                <div className="shimmer-effect" style={{
                                                    height: '14px',
                                                    width: '80px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}