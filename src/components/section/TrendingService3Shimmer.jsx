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

const ServiceCardShimmer = () => (
    <div className="col-xl-3 col-lg-4 col-sm-6 mb-4">
        <div className="listing-style1 bdrs16">
            <div className="list-thumb">
                <div className="shimmer-effect" style={{
                    height: '200px',
                    borderRadius: '16px 16px 0 0',
                    backgroundColor: '#f0f0f0'
                }}></div>
            </div>
            <div className="list-content p-3">
                <div className="shimmer-effect mb-2" style={{
                    height: '16px',
                    width: '60%',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>
                <div className="shimmer-effect mb-3" style={{
                    height: '20px',
                    width: '90%',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                }}></div>

                <div className="d-flex align-items-center mb-3">
                    <div className="shimmer-effect me-2" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '16px',
                        width: '80px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="shimmer-effect" style={{
                        height: '16px',
                        width: '60px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                    <div className="shimmer-effect" style={{
                        height: '24px',
                        width: '70px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0'
                    }}></div>
                </div>
            </div>
        </div>
    </div>
);

export default function TrendingService3Shimmer() {
    return (
        <section className="pt-0">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-9 wow fadeInUp">
                        <div className="main-title">
                            <div className="shimmer-effect mb-2" style={{
                                height: '40px',
                                width: '280px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                            <div className="shimmer-effect" style={{
                                height: '20px',
                                width: '300px',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0'
                            }}></div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="text-start text-lg-end mb-4 mb-lg-3">
                            <div className="shimmer-effect" style={{
                                height: '44px',
                                width: '130px',
                                borderRadius: '25px',
                                backgroundColor: '#f0f0f0',
                                marginLeft: 'auto'
                            }}></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ServiceCardShimmer key={index} />
                    ))}
                </div>

                {/* Navigation placeholder */}
                <div className="row justify-content-center mt-4">
                    <div className="col-auto">
                        <div className="shimmer-effect" style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                    </div>
                    <div className="col-auto">
                        <div className="shimmer-effect mx-3" style={{
                            height: '10px',
                            width: '80px',
                            borderRadius: '5px',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                    </div>
                    <div className="col-auto">
                        <div className="shimmer-effect" style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0'
                        }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}