import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('📋');

  const createMutation = useCreateProject((newProject) => {
    setIsCreateOpen(false);
    setName('');
    setDescription('');
    navigate(`/projects/${newProject.id}/board`);
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      icon,
    });
  };

  // Aggregated Stats
  const totalTasks = projects.reduce((acc, p) => acc + (p.taskCount || 6), 0);
  const inProgressTasks = Math.round(totalTasks * 0.4);
  const doneTasks = Math.round(totalTasks * 0.4);

  return (
    <div className={styles.container}>
      <Topbar title="Dashboard" />

      <div className={styles.content}>
        {/* Welcome Section */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h2>Good day, {user?.fullName || user?.username}! 👋</h2>
            <p>Here is an overview of your projects and task velocity today.</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<FolderPlus size={18} />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Projects</span>
              <div className={styles.statIconBlue}>
                <TrendingUp size={18} />
              </div>
            </div>
            <span className={styles.statValue}>{projects.length}</span>
            <span className={styles.statSub}>Across your workspaces</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Tasks</span>
              <div className={styles.statIconPurple}>
                <Clock size={18} />
              </div>
            </div>
            <span className={styles.statValue}>{totalTasks}</span>
            <span className={styles.statSub}>Managed collaboratively</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>In Progress</span>
              <div className={styles.statIconAmber}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <span className={styles.statValue}>{inProgressTasks}</span>
            <span className={styles.statSub}>Currently active</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Completed</span>
              <div className={styles.statIconGreen}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <span className={styles.statValue}>{doneTasks}</span>
            <span className={styles.statSub}>Shipped to completion</span>
          </div>
        </div>

        {/* Projects Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Your Projects</h3>
            <span className={styles.projectCount}>{projects.length} total</span>
          </div>

          {projects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={styles.projectCard}
                  onClick={() => navigate(`/projects/${project.id}/board`)}
                >
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.projectIconBadge}
                      style={{ backgroundColor: `${project.color || '#3B82F6'}18` }}
                    >
                      <span className={styles.iconEmoji}>{project.icon || '📋'}</span>
                    </div>
                    <span
                      className={styles.cardColorBar}
                      style={{ backgroundColor: project.color || '#3B82F6' }}
                    />
                  </div>

                  <h4 className={styles.projectName}>{project.name}</h4>
                  <p className={styles.projectDesc}>
                    {project.description || 'No description provided.'}
                  </p>

                  <div className={styles.cardFooter}>
                    <div className={styles.memberAvatars}>
                      <Users size={14} className={styles.usersIcon} />
                      <span>{project.memberCount || 1} members</span>
                    </div>

                    <div className={styles.openLink}>
                      <span>Open Board</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FolderPlus size={32} />}
              title="No projects yet"
              description="Get started by creating your first collaborative project workspace."
              actionLabel="Create Project"
              onAction={() => setIsCreateOpen(true)}
            />
          )}
        </div>

        {/* Quick Activity & Deadlines Grid */}
        <div className={styles.lowerGrid}>
          {/* Recent Activity */}
          <div className={styles.activityBox}>
            <h4 className={styles.boxTitle}>Recent Activity</h4>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <Avatar name="Bob Chen" size="xs" />
                <div className={styles.activityContent}>
                  <p>
                    <strong>Bob Chen</strong> moved <strong>Build Kanban board UI</strong> to In Progress
                  </p>
                  <span>10 minutes ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <Avatar name="Alice Johnson" size="xs" />
                <div className={styles.activityContent}>
                  <p>
                    <strong>Alice Johnson</strong> commented on <strong>Authentication system</strong>
                  </p>
                  <span>45 minutes ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <Avatar name="Carol Martinez" size="xs" />
                <div className={styles.activityContent}>
                  <p>
                    <strong>Carol Martinez</strong> completed <strong>Design system foundations</strong>
                  </p>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className={styles.deadlinesBox}>
            <h4 className={styles.boxTitle}>Upcoming Deadlines</h4>
            <div className={styles.deadlinesList}>
              <div className={styles.deadlineItem}>
                <Calendar size={16} className={styles.calendarIcon} />
                <div className={styles.deadlineContent}>
                  <span className={styles.deadlineTitle}>Authentication system</span>
                  <span className={styles.deadlineDate}>Nov 3, 2026 (Urgent)</span>
                </div>
              </div>
              <div className={styles.deadlineItem}>
                <Calendar size={16} className={styles.calendarIcon} />
                <div className={styles.deadlineContent}>
                  <span className={styles.deadlineTitle}>Build Kanban board UI</span>
                  <span className={styles.deadlineDate}>Nov 5, 2026</span>
                </div>
              </div>
              <div className={styles.deadlineItem}>
                <Calendar size={16} className={styles.calendarIcon} />
                <div className={styles.deadlineContent}>
                  <span className={styles.deadlineTitle}>Database schema design</span>
                  <span className={styles.deadlineDate}>Nov 6, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        description="Set up a new space for your team to plan and track tasks."
      >
        <form onSubmit={handleCreateSubmit} className={styles.modalForm}>
          <Input
            label="Project Name *"
            placeholder="e.g. Marketing Redesign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="What is this project about?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.colorRow}>
            <label className={styles.label}>Theme Color</label>
            <div className={styles.colorOptions}>
              {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((c) => (
                <button
                  type="button"
                  key={c}
                  className={styles.colorCircle}
                  style={{
                    backgroundColor: c,
                    outline: color === c ? '2px solid #0f172a' : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              disabled={!name.trim()}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
