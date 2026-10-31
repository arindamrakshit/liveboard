import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { wsManager } from '@/lib/websocket';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  useOfflineSync();

  useEffect(() => {
    wsManager.connect();
    return () => {
      wsManager.disconnect();
    };
  }, []);

  return (
    <div className={styles.layout}>
      <ConnectionStatus />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
