import React from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#6366F1', '#14B8A6', '#F97316'
];

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className }) => {
  const [imageError, setImageError] = React.useState(false);
  const initials = getInitials(name);
  const bgColor = getColorForName(name);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx(styles.avatar, styles[size], className)}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={clsx(styles.avatar, styles.initials, styles[size], className)}
      style={{ backgroundColor: bgColor }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
