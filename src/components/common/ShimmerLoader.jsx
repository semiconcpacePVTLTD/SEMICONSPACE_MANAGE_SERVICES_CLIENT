export default function ShimmerLoader({
    width = "100%",
    height = "16px",
    borderRadius = "4px",
    className = ""
}) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#e9ecef',
            }}
        >
            <style>{`
        .skeleton {
          position: relative;
          overflow: hidden;
          background: #e9ecef;
        }
        .skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(233, 236, 239, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(233, 236, 239, 0) 100%
          );
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
}