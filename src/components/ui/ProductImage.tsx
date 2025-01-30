"use client";
import { useState } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const ProductImage = ({ src, alt, fill, width, height, className, priority }: ProductImageProps) => {
  const [isError, setIsError] = useState(false);

  if (isError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <FiImage className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        onError={() => setIsError(true)}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      onError={() => setIsError(true)}
      priority={priority}
    />
  );
};

export default ProductImage; 