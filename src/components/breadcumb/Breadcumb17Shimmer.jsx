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

export default function Breadcumb17Shimmer() {
    return (
        <section className="breadcumb-section pt-0">
            <div className="cta-service-v1 freelancer-single-style mx-auto maxw1700 pt120 pt60-sm pb120 pb60-sm bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
                <img className="left-top-img wow zoomIn" src="/images/vector-img/left-top.png" alt="vector-img" />
                <img className="right-bottom-img wow zoomIn" src="/images/vector-img/right-bottom.png" alt="vector-img" />
                <div className="container">
                    <div className="row wow fadeInUp">
                        <div className="col-xl-7">
                            <div className="position-relative">
                                {/* Title shimmer */}
                                <div className="shimmer-effect mb-4" style={{
                                    height: '40px',
                                    width: '300px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>

                                <div className="list-meta d-sm-flex align-items-center mt30">
                                    <div className="position-relative freelancer-single-style">
                                        {/* Online status shimmer */}
                                        <div className="shimmer-effect rounded-circle" style={{
                                            width: '12px',
                                            height: '12px',
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: '#f0f0f0',
                                            zIndex: 1
                                        }}></div>
                                        {/* Profile image shimmer */}
                                        <div className="shimmer-effect rounded-circle mb15-sm" style={{
                                            width: '150px',
                                            height: '150px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                    </div>
                                    <div className="ml20 ml0-xs">
                                        {/* Name shimmer */}
                                        <div className="shimmer-effect mb-2" style={{
                                            height: '24px',
                                            width: '200px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                        {/* Profession shimmer */}
                                        <div className="shimmer-effect mb-3" style={{
                                            height: '18px',
                                            width: '180px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                        {/* Location shimmer */}
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="shimmer-effect me-2" style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                            <div className="shimmer-effect" style={{
                                                height: '16px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                        </div>
                                        {/* Member since shimmer */}
                                        <div className="d-flex align-items-center">
                                            <div className="shimmer-effect me-2" style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                            <div className="shimmer-effect" style={{
                                                height: '16px',
                                                width: '150px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="position-relative">
                                {/* Right side content shimmer */}
                                <div className="shimmer-effect mb-3" style={{
                                    height: '60px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div className="shimmer-effect" style={{
                                        height: '20px',
                                        width: '100px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                    <div className="shimmer-effect" style={{
                                        height: '20px',
                                        width: '80px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div className="shimmer-effect" style={{
                                        height: '20px',
                                        width: '120px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                    <div className="shimmer-effect" style={{
                                        height: '20px',
                                        width: '60px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}