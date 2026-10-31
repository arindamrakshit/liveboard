import React from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  borderRadius,
}) => {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonBoard: React.FC = () => {
  return (
    <div className={styles.boardSkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.columnSkeleton}>
          <div className={styles.columnHeader}>
            <Skeleton width="40%" height={20} />
            <Skeleton width={24} height={20} borderRadius="12px" />
          </div>
          <div className={styles.columnCards}>
            <Skeleton height={90} borderRadius="8px" />
            <Skeleton height={110} borderRadius="8px" />
            <Skeleton height={80} borderRadius="8px" />
          </div>
        </div>
      ))}
    </div>
  );
};
