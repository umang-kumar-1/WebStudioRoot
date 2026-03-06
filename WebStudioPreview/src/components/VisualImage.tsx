import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

// --- OPTIMIZED IMAGE COMPONENT ---
// This component ensures images appear smoothly with a fade-in effect and 
// prioritizes loading for critical assets. It also checks if the image is 
// already in the browser cache for instant display.
export const VisualImage = React.memo(({ src, alt, className = "", priority = false, objectFit = "cover", style = {} }: { src: string, alt: string, className?: string, priority?: boolean, objectFit?: "cover" | "contain", style?: React.CSSProperties }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Immediate check for cached images to prevent unnecessary "fade-in" for already loaded assets
    useEffect(() => {
        if (!src) {
            setIsLoaded(true);
            return;
        }

        setError(false);
        const img = new Image();
        img.src = src;

        if (img.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className} bg-gray-100`} style={{ ...style, backgroundColor: '#f3f4f6' }}>
            {/* Loading Skeleton */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200" />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                        style={{ backgroundSize: '200% 100%' }}
                    />
                </div>
            )}

            {/* Error Placeholder */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-300 z-10">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Not Found</span>
                </div>
            )}

            <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                // @ts-ignore - fetchPriority is supported in modern browsers but lacks standard React typings
                fetchPriority={priority ? "high" : "auto"}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsLoaded(true);
                    setError(true);
                }}
                className={`w-full h-full transition-all duration-700 ease-out ${objectFit === "cover" ? 'object-cover' : 'object-contain'} ${isLoaded && !error ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
        </div>
    );
});

