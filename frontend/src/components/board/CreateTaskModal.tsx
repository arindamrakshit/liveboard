import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Priority } from '@/types';
import { useCreateTask } from '@/hooks/useTask';
import styles from './CreateTaskModal.module.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultColumnId?: string;
  columns: Array<{ id: string | number; name: string }>;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  defaultColumnId,
  columns,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || (columns[0]?.id ? String(columns[0].id) : ''));
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const createTaskMutation = useCreateTask(projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        columnId: columnId || (columns[0]?.id ? String(columns[0].id) : ''),
        priority,
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setDueDate('');
          setError('');
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a task to your board. Team members will see it instantly."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Task Title *"
          placeholder="e.g. Design authentication modal"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Add details, acceptance criteria, or links..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Column</label>
            <select
              className={styles.select}
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Priority</label>
            <select
              className={styles.select}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={styles.dateInput}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={createTaskMutation.isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
