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

const FreelancerCardShimmer = () => (
    <div className="col-xl-3 col-lg-4 col-sm-6 mb-4">
        <div className="feature-style2 mb30">
            <div className="feature-img bdrs12">
                <div className="shimmer-effect bdrs12" style={{
                    width: '100%',
                    height: '466px',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
            <div className="feature-content pt15">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="shimmer-effect" style={{
                        height: '24px',
                        width: '140px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '18px',
                        width: '50px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
                <div className="shimmer-effect mb-3" style={{
                    height: '18px',
                    width: '100px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
                <div className="d-grid mt15">
                    <div className="shimmer-effect" style={{
                        height: '44px',
                        borderRadius: '6px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        </div>
    </div>
);

export default function HighestRated18Shimmer() {
    return (
        <section className="pb90 pb30-md bdrt1">
            <div className="container">
                <div className="row align-items-center wow fadeInUp">
                    <div className="col-lg-9">
                        <div className="main-title">
                            <div className="shimmer-effect mb-2" style={{
                                height: '40px',
                                width: '350px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <div className="shimmer-effect" style={{
                                height: '20px',
                                width: '380px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="text-lg-end mb-2">
                            <div className="shimmer-effect" style={{
                                height: '44px',
                                width: '150px',
                                borderRadius: '25px',
                                backgroundColor: '#f0f0f0',
                                marginLeft: 'auto'
                            }}></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="position-relative">
                            <div className="row">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <FreelancerCardShimmer key={index} />
                                ))}
                            </div>

                            {/* Navigation buttons shimmer */}
                            <div className="shimmer-effect" style={{
                                position: 'absolute',
                                left: '-50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0'
                            }}></div>

                            <div className="shimmer-effect" style={{
                                position: 'absolute',
                                right: '-50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}