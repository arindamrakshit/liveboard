import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import styles from './ConnectionStatus.module.css';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, pendingOpsCount } = useUIStore();

  if (isOnline && pendingOpsCount === 0) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        {!isOnline ? (
          <>
            <WifiOff size={16} />
            <span>You are currently offline. Changes are saved locally and will sync when reconnected.</span>
          </>
        ) : (
          <>
            <RefreshCw size={16} className={styles.syncIcon} />
            <span>Syncing {pendingOpsCount} pending changes...</span>
          </>
        )}
      </div>
      {pendingOpsCount > 0 && (
        <span className={styles.badge}>
          {pendingOpsCount} pending
        </span>
      )}
    </div>
  );
};
