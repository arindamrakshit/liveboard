import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color,
  size = 'md',
  className,
}) => {
  const customStyle = color
    ? {
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}40`,
      }
    : undefined;

  return (
    <span
      className={clsx(styles.badge, styles[variant], styles[size], className)}
      style={customStyle}
    >
      {children}
    </span>
  );
};
