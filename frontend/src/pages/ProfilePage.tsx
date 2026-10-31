import React, { useState } from 'react';
import { User, Mail, Globe, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.patch('/users/me', {
        fullName: fullName.trim(),
        bio: bio.trim(),
        timezone,
      });
      updateUser(data);
      toast.success('Profile preferences saved!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'User Profile' },
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
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <h2 className={styles.title}>Account Settings</h2>
          <p className={styles.subtitle}>Manage your profile details and personal preferences.</p>
        </div>

        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.avatarHeader}>
            <Avatar name={fullName || user?.username || 'User'} size="lg" />
            <div>
              <h3 className={styles.avatarName}>{fullName || user?.username}</h3>
              <span className={styles.avatarEmail}>{user?.email}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.row}>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Username"
                value={user?.username || ''}
                disabled
                helperText="Username cannot be changed."
              />
            </div>

            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Connected to your primary LiveBoard account."
            />

            <div className={styles.field}>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="Tell your team about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Timezone</label>
              <select
                className={styles.select}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris / Berlin (CET)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div className={styles.actions}>
              <Button type="submit" variant="primary" loading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
