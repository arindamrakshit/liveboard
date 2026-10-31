import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './ProjectSettingsPage.module.css';

export const ProjectSettingsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project } = useProject(id);
  const updateProjectMutation = useUpdateProject(id);

  // Members query
  const { data: members = [], refetch: refetchMembers } = useQuery<any[]>({
    queryKey: ['project-members', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}/members`);
      return data;
    },
    enabled: Boolean(id),
  });

  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [color, setColor] = useState(project?.color || '#3B82F6');

  // Sync when project loads
  React.useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setColor(project.color || '#3B82F6');
    }
  }, [project]);

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [isInviting, setIsInviting] = useState(false);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProjectMutation.mutate(
      { name: name.trim(), description: description.trim(), color },
      {
        onSuccess: () => toast.success('Project settings updated'),
      }
    );
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await api.post(`/projects/${id}/members`, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      toast.success(`Invited ${inviteEmail}`);
      setInviteEmail('');
      setIsInviteOpen(false);
      refetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (userId: number, username: string) => {
    if (window.confirm(`Are you sure you want to remove ${username} from this project?`)) {
      try {
        await api.delete(`/projects/${id}/members/${userId}`);
        toast.success(`Removed ${username}`);
        refetchMembers();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (
      window.prompt(
        `Type "${project?.name}" to permanently delete this project and all its tasks:`
      ) === project?.name
    ) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error('Failed to delete project');
      }
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: project?.name || 'Project', href: `/projects/${id}/board` },
    { label: 'Settings' },
  ];

  return (
    <div className={styles.container}>
      <Topbar breadcrumbs={breadcrumbs} />

      <div className={styles.content}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(`/projects/${id}/board`)}
          >
            Back to Board
          </Button>
          <h2 className={styles.title}>Project Settings</h2>
          <p className={styles.subtitle}>
            Manage workspace configuration, access permissions, and members.
          </p>
        </div>

        {/* General Details Section */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>General Information</h3>
          <form onSubmit={handleSaveDetails} className={styles.form}>
            <Input
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.colorRow}>
              <label className={styles.label}>Accent Color</label>
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
              <Button
                type="submit"
                variant="primary"
                loading={updateProjectMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Team Members Section */}
        <div className={styles.card}>
          <div className={styles.cardHeaderWithAction}>
            <div>
              <h3 className={styles.cardTitle}>Team Members</h3>
              <p className={styles.cardSub}>
                Collaborators with access to this board and its real-time updates.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<UserPlus size={15} />}
              onClick={() => setIsInviteOpen(true)}
            >
              Invite Member
            </Button>
          </div>

          <div className={styles.membersList}>
            {members.map((member) => (
              <div key={member.id} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <Avatar name={member.fullName || member.username} size="sm" />
                  <div>
                    <span className={styles.memberName}>
                      {member.fullName || member.username}
                    </span>
                    <span className={styles.memberEmail}>{member.email}</span>
                  </div>
                </div>

                <div className={styles.memberRight}>
                  <Badge
                    variant={
                      member.role === 'OWNER'
                        ? 'primary'
                        : member.role === 'ADMIN'
                        ? 'info'
                        : 'default'
                    }
                  >
                    {member.role}
                  </Badge>

                  {member.role !== 'OWNER' && (
                    <button
                      className={styles.removeMemberBtn}
                      onClick={() => handleRemoveMember(member.userId, member.username)}
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className={styles.dangerCard}>
          <div className={styles.dangerHeader}>
            <AlertTriangle size={20} className={styles.dangerIcon} />
            <div>
              <h3 className={styles.dangerTitle}>Danger Zone</h3>
              <p className={styles.dangerSub}>
                Permanently delete this project and all associated tasks, comments, and columns.
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteProject}>
            Delete Project
          </Button>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Team Member"
        description="Add a collaborator by email address."
        maxWidth="sm"
      >
        <form onSubmit={handleInviteSubmit} className={styles.modalForm}>
          <Input
            label="User Email"
            type="email"
            placeholder="colleague@liveboard.dev"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />

          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className={styles.select}
            >
              <option value="MEMBER">Member (Can edit tasks)</option>
              <option value="ADMIN">Admin (Can invite members)</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isInviting}>
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
