import Image from 'next/image';
import React from 'react';

interface ArctaLogoProps {
  variant?: 'default' | 'footer' | 'mobile';
  imageSize?: number;
  className?: string;
}

/**
 * A reusable component for displaying the Arcta logo with text
 * The dark green color (#023535) is used for the brand text "ARCTA"
 */
export default function ArctaLogo({
  variant = 'default',
  imageSize = 48,
  className = '',
}: ArctaLogoProps) {
  let textClasses = '';
  
  switch (variant) {
    case 'footer':
      textClasses = 'text-2xl font-semibold text-primary-green bg-white px-1 rounded';
      break;
    case 'mobile':
      textClasses = 'text-2xl font-semibold text-dark-green';
      break;
    default:
      textClasses = 'text-2xl font-semibold text-dark-green';
      break;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/arcta-logo.png"
        alt="Arcta"
        width={imageSize}
        height={imageSize}
        className="mr-3"
      />
      <span className={textClasses}>
        ARCTA
      </span>
    </div>
  );
} 