import React from 'react';

interface ButterflyProps {
  size?: number;
  className?: string;
  color?: string;
  wingColor?: string;
  patternColor?: string;
  style?: React.CSSProperties;
}

export const ButterflySvg: React.FC<ButterflyProps> = ({
  size = 40,
  color = '#f472b6',
  wingColor = '#fbcfe8',
  patternColor = '#fda4af',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`inline-block pointer-events-none select-none ${className}`}
      style={{ width: size, height: size * 0.85, ...style }}
    >
      <svg
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Left Wing Group */}
        <g className="butterfly-wing-l">
          {/* Upper Left Wing */}
          <path
            d="M50 42 C45 20, 20 5, 5 18 C-3 27, 8 50, 48 44 Z"
            fill={wingColor}
            fillOpacity="0.55"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          {/* Upper Wing inner decorative petal */}
          <path
            d="M45 38 C38 24, 22 15, 14 22 C9 27, 18 42, 44 40 Z"
            fill={patternColor}
            fillOpacity="0.4"
          />
          {/* Lower Left Wing */}
          <path
            d="M48 44 C35 55, 12 55, 18 72 C23 82, 42 74, 50 48 Z"
            fill={wingColor}
            fillOpacity="0.5"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          <path
            d="M46 47 C38 55, 24 57, 26 68 C29 74, 40 68, 47 50 Z"
            fill={patternColor}
            fillOpacity="0.35"
          />
        </g>

        {/* Right Wing Group */}
        <g className="butterfly-wing-r">
          {/* Upper Right Wing */}
          <path
            d="M50 42 C55 20, 80 5, 95 18 C103 27, 92 50, 52 44 Z"
            fill={wingColor}
            fillOpacity="0.55"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          {/* Upper Wing inner decorative petal */}
          <path
            d="M55 38 C62 24, 78 15, 86 22 C91 27, 82 42, 56 40 Z"
            fill={patternColor}
            fillOpacity="0.4"
          />
          {/* Lower Right Wing */}
          <path
            d="M52 44 C65 55, 88 55, 82 72 C77 82, 58 74, 50 48 Z"
            fill={wingColor}
            fillOpacity="0.5"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          <path
            d="M54 47 C62 55, 76 57, 74 68 C71 74, 60 68, 53 50 Z"
            fill={patternColor}
            fillOpacity="0.35"
          />
        </g>

        {/* Body and Antennae (Center) */}
        <path
          d="M50 32 C49 32, 48 40, 48.5 50 C49 56, 51 56, 51.5 50 C52 40, 51 32, 50 32 Z"
          fill={color}
          fillOpacity="0.75"
        />
        {/* Left Antenna */}
        <path
          d="M49 32 C47 22, 40 18, 38 19"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <circle cx="38" cy="19" r="1.5" fill={color} fillOpacity="0.8" />
        {/* Right Antenna */}
        <path
          d="M51 32 C53 22, 60 18, 62 19"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <circle cx="62" cy="19" r="1.5" fill={color} fillOpacity="0.8" />
      </svg>
    </div>
  );
};

export const ButterflyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Soft Rose Background Tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff7f8]/90 via-[#fff0f4]/80 to-[#fdf2f5]/90" />

      {/* Gentle Radial ambient glow spots in pastel pink */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#fde2e8]/45 blur-3xl" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-[#fce7f3]/40 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#fee2e2]/35 blur-3xl" />

      {/* Floating Gentle Butterflies with varying sizes, positions, delays */}
      {/* 1. Top Right Floating Butterfly */}
      <div
        className="absolute top-[8%] right-[10%] opacity-70"
        style={{ animation: 'butterfly-float-1 20s ease-in-out infinite' }}
      >
        <ButterflySvg size={46} color="#f472b6" wingColor="#fbcfe8" patternColor="#fda4af" />
      </div>

      {/* 2. Top Left Floating Butterfly */}
      <div
        className="absolute top-[14%] left-[8%] opacity-55"
        style={{ animation: 'butterfly-float-2 24s ease-in-out 3s infinite' }}
      >
        <ButterflySvg size={38} color="#ec4899" wingColor="#fce7f3" patternColor="#fbcfe8" />
      </div>

      {/* 3. Mid Left Floating Butterfly */}
      <div
        className="absolute top-[48%] left-[5%] opacity-65"
        style={{ animation: 'butterfly-float-1 22s ease-in-out 6s infinite' }}
      >
        <ButterflySvg size={42} color="#f472b6" wingColor="#fbcfe8" patternColor="#fda4af" />
      </div>

      {/* 4. Mid Right Floating Butterfly */}
      <div
        className="absolute top-[52%] right-[7%] opacity-60"
        style={{ animation: 'butterfly-float-2 26s ease-in-out 9s infinite' }}
      >
        <ButterflySvg size={34} color="#f43f5e" wingColor="#fee2e2" patternColor="#fecdd3" />
      </div>

      {/* 5. Bottom Right Floating Butterfly */}
      <div
        className="absolute bottom-[12%] right-[16%] opacity-65"
        style={{ animation: 'butterfly-float-1 21s ease-in-out 4s infinite' }}
      >
        <ButterflySvg size={48} color="#f472b6" wingColor="#fbcfe8" patternColor="#fda4af" />
      </div>

      {/* 6. Bottom Left Delicate Small Butterfly */}
      <div
        className="absolute bottom-[15%] left-[14%] opacity-55"
        style={{ animation: 'butterfly-float-2 25s ease-in-out 11s infinite' }}
      >
        <ButterflySvg size={32} color="#ec4899" wingColor="#fce7f3" patternColor="#fda4af" />
      </div>

      {/* 7. Subtle Center-Top Drifting Butterfly */}
      <div
        className="hidden md:block absolute top-[28%] right-[32%] opacity-40"
        style={{ animation: 'butterfly-float-1 28s ease-in-out 14s infinite' }}
      >
        <ButterflySvg size={28} color="#f472b6" wingColor="#ffe4e6" patternColor="#fecdd3" />
      </div>

      {/* 8. Center-Bottom Soft Butterfly */}
      <div
        className="hidden md:block absolute bottom-[28%] left-[30%] opacity-40"
        style={{ animation: 'butterfly-float-2 27s ease-in-out 7s infinite' }}
      >
        <ButterflySvg size={30} color="#fb7185" wingColor="#ffe4e6" patternColor="#fbcfe8" />
      </div>
    </div>
  );
};
