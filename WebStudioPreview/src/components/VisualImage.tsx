import React, { useState, useEffect } from 'react';

// --- OPTIMIZED IMAGE COMPONENT ---
// This component ensures images appear smoothly with a fade-in effect and 
// prioritizes loading for critical assets. It also checks if the image is 
// already in the browser cache for instant display.
export const VisualImage = React.memo(({ src, alt, className = "", priority = false, objectFit = "cover", style = {} }: { src: string, alt: string, className?: string, priority?: boolean, objectFit?: "cover" | "contain", style?: React.CSSProperties }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Immediate check for cached images to prevent unnecessary "fade-in" for already loaded assets
    useEffect(() => {
        if (!src) return;
        const img = new Image();
        img.src = src;
        if (img.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                // @ts-ignore - fetchPriority is supported in modern browsers but lacks standard React typings
                fetchPriority={priority ? "high" : "auto"}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full transition-all duration-500 ease-out ${objectFit === "cover" ? 'object-cover' : 'object-contain'} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
                style={style}
            />

            {/* Subtle Loading Shimmer (Optional, but helps with perceived speed) */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                    style={{ backgroundSize: '200% 100%' }} />
            )}
        </div>
    );
});
