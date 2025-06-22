import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { lazyLoadImage } from '@/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23f3f4f6'/%3E%3C/svg%3E",
  fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23ef4444'/%3E%3C/svg%3E",
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    if (loading === 'eager') {
      // Load immediately for critical images
      loadImage(src);
    } else {
      // Use intersection observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(src);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [src, loading]);

  const loadImage = async (imageSrc: string) => {
    try {
      if (imgRef.current) {
        await lazyLoadImage(imgRef.current, imageSrc, placeholder);
        setImageSrc(imageSrc);
        setIsLoading(false);
        onLoad?.();
      }
    } catch (error) {
      console.error('Failed to load image:', error);
      setImageSrc(fallback);
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'opacity-50'
        )}
        loading={loading}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setImageSrc(fallback);
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-center">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-xs text-red-600">Image failed to load</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;