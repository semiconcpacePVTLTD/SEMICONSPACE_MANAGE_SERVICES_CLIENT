import React from 'react';

// Shimmer effect CSS
const shimmerStyles = {
    shimmer: {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
    },
    '@keyframes shimmer': {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
    }
};

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

// Service Card Shimmer
export const ServiceCardShimmer = () => (
    <div className="col-sm-6 col-lg-3 mb-4">
        <div className="card border-0 shadow-sm">
            <div className="shimmer-effect" style={{ height: '200px', borderRadius: '8px 8px 0 0' }}></div>
            <div className="card-body">
                <div className="shimmer-effect mb-3" style={{ height: '20px', borderRadius: '4px' }}></div>
                <div className="shimmer-effect mb-2" style={{ height: '16px', width: '70%', borderRadius: '4px' }}></div>
                <div className="d-flex align-items-center mb-3">
                    <div className="shimmer-effect me-2" style={{ width: '30px', height: '30px', borderRadius: '50%' }}></div>
                    <div className="shimmer-effect" style={{ height: '14px', width: '80px', borderRadius: '4px' }}></div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="shimmer-effect" style={{ height: '16px', width: '60px', borderRadius: '4px' }}></div>
                    <div className="shimmer-effect" style={{ height: '18px', width: '50px', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>
    </div>
);

// Freelancer Card Shimmer
export const FreelancerCardShimmer = () => (
    <div className="col-sm-6 col-lg-3 mb-4">
        <div className="feature-style2 mb30">
            <div className="feature-img bdrs12">
                <div className="shimmer-effect bdrs12" style={{ width: '100%', height: '466px' }}></div>
            </div>
            <div className="feature-content pt15">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="shimmer-effect" style={{ height: '20px', width: '120px', borderRadius: '4px' }}></div>
                    <div className="shimmer-effect" style={{ height: '16px', width: '40px', borderRadius: '4px' }}></div>
                </div>
                <div className="shimmer-effect mb-3" style={{ height: '16px', width: '80px', borderRadius: '4px' }}></div>
                <div className="d-grid mt15">
                    <div className="shimmer-effect" style={{ height: '44px', borderRadius: '6px' }}></div>
                </div>
            </div>
        </div>
    </div>
);

// Section Shimmer (for full sections)
export const SectionShimmer = ({ title, cardType = "service", cardCount = 4 }) => {
    const CardComponent = cardType === "freelancer" ? FreelancerCardShimmer : ServiceCardShimmer;

    return (
        <section className="pt-0">
            <div className="container">
                <div className="row align-items-center mb-4">
                    <div className="col-lg-9">
                        <div className="main-title">
                            <div className="shimmer-effect mb-2" style={{ height: '32px', width: '300px', borderRadius: '4px' }}></div>
                            <div className="shimmer-effect" style={{ height: '16px', width: '400px', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="text-start text-lg-end">
                            <div className="shimmer-effect" style={{ height: '44px', width: '120px', borderRadius: '25px', marginLeft: 'auto' }}></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {Array.from({ length: cardCount }).map((_, index) => (
                        <CardComponent key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SectionShimmer;