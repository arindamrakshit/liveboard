import React, { useState } from 'react';
import { Search, Bell, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import styles from './Topbar.module.css';

interface TopbarProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const Topbar: React.FC<TopbarProps> = ({ title, breadcrumbs }) => {
  const { searchQuery, setSearchQuery, isOnline } = useUIStore();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className={styles.topbar}>
      {/* Left: Breadcrumbs or Title */}
      <div className={styles.leftSection}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className={styles.divider}>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className={styles.crumbLink}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className={styles.activeCrumb}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <h1 className={styles.pageTitle}>{title || 'LiveBoard'}</h1>
        )}
      </div>

      {/* Middle: Global Search */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks, projects, members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Global search"
          />
        </div>
      </div>

      {/* Right: Actions, Connection Indicator, Profile */}
      <div className={styles.rightSection}>
        {/* Real-time Indicator */}
        <div
          className={styles.connectionDot}
          title={isOnline ? 'Real-time WebSocket connected' : 'Offline mode'}
        >
          {isOnline ? (
            <span className={styles.livePulse}>
              <span className={styles.pulseDot} />
              <span className={styles.liveLabel}>Live</span>
            </span>
          ) : (
            <span className={styles.offlineBadge}>
              <WifiOff size={14} />
              <span>Offline</span>
            </span>
          )}
        </div>

        {/* Notifications */}
        <button
          className={styles.iconButton}
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className={styles.notificationDot} />
        </button>

        {/* User avatar */}
        <div className={styles.userSection}>
          <Avatar name={user?.fullName || user?.username || 'User'} size="sm" />
        </div>
      </div>
    </header>
  );
};
