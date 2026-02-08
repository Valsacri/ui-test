interface StandingAvatarProps {
  skinTone?: string;
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  className?: string;
}

export function StandingAvatar({
  skinTone = '#F4C2A0',
  hairColor = '#4A3728',
  shirtColor = '#003C66',
  pantsColor = '#2C3E50',
  className = ''
}: StandingAvatarProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* Head */}
      <ellipse cx="100" cy="60" rx="35" ry="40" fill={skinTone} />
      
      {/* Hair */}
      <ellipse cx="100" cy="40" rx="38" ry="25" fill={hairColor} />
      
      {/* Eyes */}
      <circle cx="90" cy="55" r="3" fill="#2C3E50" />
      <circle cx="110" cy="55" r="3" fill="#2C3E50" />
      
      {/* Smile */}
      <path
        d="M 90 70 Q 100 75 110 70"
        stroke="#2C3E50"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Neck */}
      <rect x="90" y="90" width="20" height="15" fill={skinTone} />
      
      {/* Body/Shirt */}
      <path
        d="M 60 105 L 60 200 L 90 200 L 90 105 Z"
        fill={shirtColor}
      />
      <path
        d="M 110 105 L 110 200 L 140 200 L 140 105 Z"
        fill={shirtColor}
      />
      <rect x="60" y="105" width="80" height="95" fill={shirtColor} />
      
      {/* Arms */}
      <rect x="40" y="110" width="20" height="70" rx="10" fill={skinTone} />
      <rect x="140" y="110" width="20" height="70" rx="10" fill={skinTone} />
      
      {/* Pants */}
      <rect x="65" y="200" width="30" height="85" fill={pantsColor} />
      <rect x="105" y="200" width="30" height="85" fill={pantsColor} />
      
      {/* Shoes */}
      <ellipse cx="80" cy="290" rx="15" ry="8" fill="#1A1A1A" />
      <ellipse cx="120" cy="290" rx="15" ry="8" fill="#1A1A1A" />
    </svg>
  );
}