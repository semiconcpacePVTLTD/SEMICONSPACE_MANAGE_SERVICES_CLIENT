import React from 'react';
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";

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

export default function ServiceDetails3Shimmer() {
    const isMatchedScreen = useScreen(1216);

    return (
        <StickyContainer>
            <section className="pt10 pb90 pb30-md">
                <div className="container">
                    <div className="row wrap">
                        <div className="col-lg-8">
                            <div className="column">
                                {/* Header Section */}
                                <div className="row px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                                    <div className="col-xl-12 mb30 pb30 bdrb1">
                                        <div className="position-relative">
                                            <div className="shimmer-effect mb-3" style={{
                                                height: '40px',
                                                width: '80%',
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                        </div>
                                    </div>

                                    {/* Feature Icons */}
                                    <div className="row">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="col-sm-6 col-md-4">
                                                <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                                                    <div className="icon flex-shrink-0">
                                                        <div className="shimmer-effect" style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}></div>
                                                    </div>
                                                    <div className="details ms-3">
                                                        <div className="shimmer-effect mb-2" style={{
                                                            height: '20px',
                                                            width: '120px',
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
                                        ))}
                                    </div>
                                </div>

                                {/* Image Gallery Section */}
                                <div className="row px30 bdr1 pt30 pb30 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                                    <div className="col-xl-12">
                                        <div className="shimmer-effect mb-3" style={{
                                            height: '300px',
                                            width: '100%',
                                            borderRadius: '8px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                        <div className="d-flex gap-3 mt-3">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="shimmer-effect" style={{
                                                    height: '80px',
                                                    width: '80px',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="row px30 bdr1 pt30 pb30 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                                    <div className="col-xl-12">
                                        <div className="shimmer-effect mb-3" style={{
                                            height: '24px',
                                            width: '200px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="shimmer-effect mb-2" style={{
                                                height: '16px',
                                                width: `${90 - index * 10}%`,
                                                borderRadius: '4px',
                                                backgroundColor: '#f0f0f0'
                                            }}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Extra Information Section */}
                                <div className="row px30 bdr1 pt30 pb30 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                                    <div className="col-xl-12">
                                        <div className="shimmer-effect mb-3" style={{
                                            height: '24px',
                                            width: '180px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f0f0'
                                        }}></div>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="d-flex align-items-center mb-3">
                                                <div className="shimmer-effect me-3" style={{
                                                    height: '16px',
                                                    width: '100px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                                <div className="shimmer-effect" style={{
                                                    height: '16px',
                                                    width: '200px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="column">
                                {!isMatchedScreen ? (
                                    <div className="scrollbalance-inner">
                                        <div className="blog-sidebar ms-lg-auto">
                                            {/* Contact Widget Shimmer */}
                                            <div className="price-widget pt25 bdrs8">
                                                <div className="shimmer-effect mb-3" style={{
                                                    height: '32px',
                                                    width: '150px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                                <div className="shimmer-effect mb-4" style={{
                                                    height: '48px',
                                                    width: '100%',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                                <div className="shimmer-effect mb-3" style={{
                                                    height: '48px',
                                                    width: '100%',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                            </div>

                                            {/* Freelancer Cards Shimmer */}
                                            <div className="blog-sidebar-widget">
                                                <div className="shimmer-effect mb-4" style={{
                                                    height: '24px',
                                                    width: '180px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f0f0f0'
                                                }}></div>
                                                {Array.from({ length: 4 }).map((_, index) => (
                                                    <div key={index} className="freelancer-style1 mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="shimmer-effect me-3" style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '50%',
                                                                backgroundColor: '#f0f0f0'
                                                            }}></div>
                                                            <div className="flex-grow-1">
                                                                <div className="shimmer-effect mb-2" style={{
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
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Sticky topOffset={-150}>
                                        {({ style }) => (
                                            <div className="scrollbalance-inner" style={style}>
                                                <div className="blog-sidebar ms-lg-auto">
                                                    {/* Same shimmer content as above */}
                                                    <div className="price-widget pt25 bdrs8">
                                                        <div className="shimmer-effect mb-3" style={{
                                                            height: '32px',
                                                            width: '150px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}></div>
                                                        <div className="shimmer-effect mb-4" style={{
                                                            height: '48px',
                                                            width: '100%',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}></div>
                                                        <div className="shimmer-effect mb-3" style={{
                                                            height: '48px',
                                                            width: '100%',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}></div>
                                                    </div>

                                                    <div className="blog-sidebar-widget">
                                                        <div className="shimmer-effect mb-4" style={{
                                                            height: '24px',
                                                            width: '180px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}></div>
                                                        {Array.from({ length: 4 }).map((_, index) => (
                                                            <div key={index} className="freelancer-style1 mb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="shimmer-effect me-3" style={{
                                                                        width: '50px',
                                                                        height: '50px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#f0f0f0'
                                                                    }}></div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="shimmer-effect mb-2" style={{
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
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Sticky>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </StickyContainer>
    );
}