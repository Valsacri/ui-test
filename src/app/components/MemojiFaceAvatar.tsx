interface MemojiFaceAvatarProps {
  skinTone?: string;
  hairColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MemojiFaceAvatar({
  skinTone = '#F4C2A0',
  hairColor = '#4A3728',
  size = 'md'
}: MemojiFaceAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const sizeClass = sizeClasses[size];

  return (
    <div className={`${sizeClass} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background Circle */}
        <circle cx="50" cy="50" r="48" fill="#E8F4F8" />
        
        {/* Head */}
        <ellipse cx="50" cy="55" rx="28" ry="32" fill={skinTone} />
        
        {/* Hair */}
        <path
          d="M 22 40 Q 22 20 50 18 Q 78 20 78 40 Q 78 35 75 33 Q 72 28 68 26 Q 60 22 50 22 Q 40 22 32 26 Q 28 28 25 33 Q 22 35 22 40 Z"
          fill={hairColor}
        />
        
        {/* Ears */}
        <ellipse cx="21" cy="50" rx="4" ry="6" fill={skinTone} opacity="0.9" />
        <ellipse cx="79" cy="50" rx="4" ry="6" fill={skinTone} opacity="0.9" />
        
        {/* Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="38" cy="48" rx="3.5" ry="4.5" fill="white" />
          <circle cx="38.5" cy="48.5" r="2.5" fill="#2C3E50" />
          <circle cx="39" cy="47.8" r="1" fill="white" opacity="0.8" />
          
          {/* Right Eye */}
          <ellipse cx="62" cy="48" rx="3.5" ry="4.5" fill="white" />
          <circle cx="61.5" cy="48.5" r="2.5" fill="#2C3E50" />
          <circle cx="61" cy="47.8" r="1" fill="white" opacity="0.8" />
        </g>
        
        {/* Eyebrows */}
        <path
          d="M 32 42 Q 38 40 44 42"
          stroke={hairColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 56 42 Q 62 40 68 42"
          stroke={hairColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Nose */}
        <path
          d="M 50 52 Q 48 58 47 60"
          stroke={skinTone}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M 50 52 Q 52 58 53 60"
          stroke={skinTone}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        
        {/* Mouth - Slight smile */}
        <path
          d="M 40 65 Q 50 68 60 65"
          stroke="#E89B9B"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Neck */}
        <rect x="42" y="80" width="16" height="12" fill={skinTone} rx="2" />
        
        {/* Shoulders/Shirt Hint */}
        <path
          d="M 30 92 Q 35 85 42 82 L 58 82 Q 65 85 70 92"
          fill="#003C66"
        />
        
        {/* Subtle shading for depth */}
        <ellipse cx="50" cy="70" rx="12" ry="6" fill="black" opacity="0.03" />
      </svg>
    </div>
  );
}
