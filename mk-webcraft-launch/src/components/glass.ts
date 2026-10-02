import type React from 'react';

export const glass = (strength = 1): React.CSSProperties => ({
  background: `linear-gradient(180deg, rgba(34,34,38,${0.86 * strength}) 0%, rgba(18,18,21,${0.9 * strength}) 100%)`,
  border: `1px solid rgba(255,255,255,${0.12 * strength})`,
  boxShadow: `0 24px 60px rgba(0,0,0,${0.5 * strength}), inset 0 1px 0 rgba(255,255,255,${0.09 * strength})`,
});
