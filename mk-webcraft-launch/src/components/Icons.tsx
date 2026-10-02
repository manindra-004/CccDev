import React from 'react';

type IconProps = { size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties };

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', ...style }}
  >
    {children}
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const WarningIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
    <path d="M12 10v4.5" />
    <path d="M12 17.4v.1" />
  </Svg>
);

export const PenIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 19.5 19.5 12l-3-3L9 16.5l-1 4 4-1Z" />
    <path d="M14.5 7 17 4.5l2.5 2.5L17 9.5" />
    <path d="M3 21h6" />
  </Svg>
);

export const CodeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m8 7-5 5 5 5" />
    <path d="m16 7 5 5-5 5" />
    <path d="m13.5 4.5-3 15" />
  </Svg>
);

export const SparkIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
    <path d="M19 16.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5Z" />
  </Svg>
);

export const LayoutIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M9 9v11" />
  </Svg>
);

export const DevicesIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="14" height="10.5" rx="1.8" />
    <path d="M6 18h7" />
    <rect x="17" y="8.5" width="5" height="11" rx="1.4" />
  </Svg>
);

export const BoltIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
  </Svg>
);

export const RankIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 20.5h17" />
    <path d="M6 16.5 10 12l3 3 6-6.5" />
    <path d="M15 8.5h4v4" />
  </Svg>
);

export const SupportIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4.5 13.5v-1.5a7.5 7.5 0 0 1 15 0v1.5" />
    <rect x="3" y="13" width="4" height="6" rx="1.6" />
    <rect x="17" y="13" width="4" height="6" rx="1.6" />
    <path d="M19 19c0 1.5-1.8 2.5-5 2.5" />
  </Svg>
);

export const BagIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1.2 12.5H6.2L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </Svg>
);

export const MenuIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 8h16" />
    <path d="M4 16h16" />
  </Svg>
);

export const TrendDownIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 6.5 10 13l3.5-3.5 7 7" />
    <path d="M20.5 11.5v5h-5" />
  </Svg>
);
