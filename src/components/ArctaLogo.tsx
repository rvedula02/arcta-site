import Image from 'next/image';
import React from 'react';

interface ArctaLogoProps {
  imageSize?: number;
  className?: string;
}

/**
 * A reusable component for displaying the Arcta word logo
 * Uses the arcta_word.png image instead of text
 */
export default function ArctaLogo({
  imageSize = 48,
  className = '',
}: ArctaLogoProps) {
  // Calculate word logo dimensions based on imageSize
  const wordLogoHeight = imageSize * 0.6; // Proportional height
  const wordLogoWidth = wordLogoHeight * 3; // Approximately 3:1 aspect ratio for word logo
  
  return (
    <div className={`flex items-start ${className}`}>
      <Image
        src="/arcta_word.png"
        alt="Arcta"
        width={wordLogoWidth}
        height={wordLogoHeight}
        className="object-contain"
        priority
      />
    </div>
  );
} 