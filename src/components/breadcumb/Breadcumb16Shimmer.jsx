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

export default function Breadcumb16Shimmer() {
    return (
        <section className="breadcumb-section pt-0">
            <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
                <img
                    className="left-top-img wow zoomIn"
                    src="/images/vector-img/left-top.png"
                    alt="vector"
                />
                <img
                    className="right-bottom-img wow zoomIn"
                    src="/images/vector-img/right-bottom.png"
                    alt="vector"
                />
                <img
                    className="service-v1-vector bounce-y d-none d-lg-block"
                    src="/images/vector-img/vector-service-v1.webp"
                    alt="vector"
                />
                <div className="container">
                    <div className="row wow fadeInUp">
                        <div className="col-xl-5">
                            <div className="position-relative">
                                {/* Title shimmer */}
                                <div className="shimmer-effect mb-3" style={{
                                    height: '32px',
                                    width: '200px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>
                                {/* Description shimmer */}
                                <div className="shimmer-effect" style={{
                                    height: '48px',
                                    width: '90%',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}