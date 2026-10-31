import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Kanban,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderKanban,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { Avatar } from '@/components/ui/Avatar';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const { data: projects = [] } = useProjects();
  const navigate = useNavigate();

  return (
    <aside className={clsx(styles.sidebar, sidebarCollapsed && styles.collapsed)}>
      {/* Brand Header */}
      <div className={styles.header}>
        <div className={styles.brand} onClick={() => navigate('/dashboard')}>
          <div className={styles.logoIcon}>
            <Kanban size={20} />
          </div>
          {!sidebarCollapsed && <span className={styles.brandName}>LiveBoard</span>}
        </div>
        <button
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className={styles.navSection}>
        <div className={styles.navGroup}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => clsx(styles.navItem, isActive && styles.active)}
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        {/* Projects Section */}
        <div className={styles.projectsGroup}>
          {!sidebarCollapsed && (
            <div className={styles.projectsHeader}>
              <span className={styles.groupTitle}>Projects</span>
              <button
                className={styles.addProjectBtn}
                onClick={() => navigate('/dashboard')}
                title="Create project"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className={styles.projectList}>
            {projects.slice(0, 8).map((project) => (
              <NavLink
                key={project.id}
                to={`/projects/${project.id}/board`}
                className={({ isActive }) => clsx(styles.projectItem, isActive && styles.active)}
                title={project.name}
              >
                <span
                  className={styles.projectColor}
                  style={{ backgroundColor: project.color || '#3B82F6' }}
                />
                {!sidebarCollapsed && <span className={styles.projectName}>{project.name}</span>}
              </NavLink>
            ))}
            {projects.length === 0 && !sidebarCollapsed && (
              <span className={styles.noProjects}>No projects yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className={styles.footer}>
        <NavLink
          to="/profile"
          className={({ isActive }) => clsx(styles.profileItem, isActive && styles.active)}
          title="Profile"
        >
          <Avatar name={user?.fullName || user?.username || 'User'} size="sm" />
          {!sidebarCollapsed && (
            <div className={styles.profileText}>
              <span className={styles.profileName}>{user?.fullName || user?.username}</span>
              <span className={styles.profileRole}>{user?.email}</span>
            </div>
          )}
        </NavLink>

        <button
          className={styles.logoutButton}
          onClick={logout}
          title="Sign Out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
