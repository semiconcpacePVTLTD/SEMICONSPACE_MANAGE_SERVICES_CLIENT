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

export default function Breadcumb3Shimmer() {
    return (
        <section className="breadcumb-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcumb-style1">
                            <div className="breadcumb-list d-flex align-items-center">
                                <div className="shimmer-effect me-2" style={{
                                    height: '18px',
                                    width: '60px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0'
                                }}></div>
                                <span className="me-2">/</span>
                                <div className="shimmer-effect" style={{
                                    height: '18px',
                                    width: '80px',
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