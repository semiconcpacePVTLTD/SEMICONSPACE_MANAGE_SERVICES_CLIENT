import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({
    children,
    shimmer,
    delay = 500,
    rootMargin = '100px',
    threshold = 0.1,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const elementRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Add a small delay before rendering the actual component
                    setTimeout(() => {
                        setShouldRender(true);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin,
                threshold
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay, rootMargin, threshold]);

    return (
        <div ref={elementRef} className={className}>
            {shouldRender ? children : (isVisible ? shimmer : null)}
        </div>
    );
};

export default LazySection;