import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Trash2,
  Calendar,
  MessageSquare,
  Send,
  User as UserIcon,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from './PriorityBadge';
import { useBoardStore } from '@/stores/boardStore';
import { useUIStore } from '@/stores/uiStore';
import { useUpdateTask, useDeleteTask, useAddComment } from '@/hooks/useTask';
import type { Priority, TaskStatus } from '@/types';
import styles from './TaskDetailModal.module.css';

interface TaskDetailModalProps {
  projectId: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ projectId }) => {
  const { selectedTaskId, setSelectedTask } = useUIStore();
  const { board } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [commentContent, setCommentContent] = useState('');

  // Find the selected task across all columns
  let currentTask: any = null;
  if (board && selectedTaskId) {
    for (const col of board.columns) {
      const found = col.tasks.find((t) => String(t.id) === String(selectedTaskId));
      if (found) {
        currentTask = found;
        break;
      }
    }
  }

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setPriority(currentTask.priority);
      setDueDate(currentTask.dueDate || '');
    }
  }, [currentTask]);

  const updateMutation = useUpdateTask(projectId);
  const deleteMutation = useDeleteTask(projectId);
  const commentMutation = useAddComment(projectId);

  if (!selectedTaskId || !currentTask) return null;

  const handleSaveTitle = () => {
    if (title.trim() && title !== currentTask.title) {
      updateMutation.mutate({ taskId: String(currentTask.id), title: title.trim() });
    }
  };

  const handleSaveDescription = () => {
    if (description !== currentTask.description) {
      updateMutation.mutate({ taskId: String(currentTask.id), description: description.trim() });
    }
  };

  const handlePriorityChange = (p: Priority) => {
    setPriority(p);
    updateMutation.mutate({ taskId: String(currentTask.id), priority: p });
  };

  const handleDueDateChange = (d: string) => {
    setDueDate(d);
    updateMutation.mutate({ taskId: String(currentTask.id), dueDate: d || null });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(String(currentTask.id), {
        onSuccess: () => setSelectedTask(null),
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    commentMutation.mutate(
      { taskId: String(currentTask.id), content: commentContent.trim() },
      {
        onSuccess: () => setCommentContent(''),
      }
    );
  };

  return (
    <Modal
      isOpen={Boolean(selectedTaskId)}
      onClose={() => setSelectedTask(null)}
      variant="side-panel"
      className={styles.modalBody}
    >
      <div className={styles.container}>
        {/* Top actions & Status */}
        <div className={styles.topBar}>
          <div className={styles.prioritySelector}>
            <label className={styles.metaLabel}>Priority</label>
            <select
              value={priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className={styles.prioritySelect}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 size={16} />}
            className={styles.deleteBtn}
          >
            Delete
          </Button>
        </div>

        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSaveTitle}
          className={styles.titleInput}
          placeholder="Task title..."
        />

        {/* Metadata Grid */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Assignee</span>
            <div className={styles.assigneeBox}>
              {currentTask.assignee ? (
                <>
                  <Avatar
                    name={currentTask.assignee.fullName || currentTask.assignee.username}
                    size="sm"
                  />
                  <span>{currentTask.assignee.fullName || currentTask.assignee.username}</span>
                </>
              ) : (
                <span className={styles.unassigned}>Unassigned</span>
              )}
            </div>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Due Date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => handleDueDateChange(e.target.value)}
              className={styles.datePicker}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description</h4>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSaveDescription}
            placeholder="Add detailed description or notes..."
            rows={5}
            className={styles.descTextarea}
          />
        </div>

        {/* Comments Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            Comments {currentTask.comments ? `(${currentTask.comments.length})` : ''}
          </h4>

          {/* New Comment Box */}
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className={styles.commentInput}
            />
            <div className={styles.commentActions}>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={commentMutation.isPending}
                leftIcon={<Send size={14} />}
              >
                Comment
              </Button>
            </div>
          </form>

          {/* Comment List */}
          <div className={styles.commentList}>
            {currentTask.comments && currentTask.comments.length > 0 ? (
              currentTask.comments.map((comment: any) => (
                <div key={comment.id} className={styles.commentItem}>
                  <Avatar
                    name={comment.author?.fullName || comment.author?.username || 'User'}
                    size="sm"
                  />
                  <div className={styles.commentBody}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>
                        {comment.author?.fullName || comment.author?.username}
                      </span>
                      <span className={styles.commentTime}>
                        {comment.createdAt ? format(parseISO(comment.createdAt), 'MMM d, h:mm a') : 'Just now'}
                      </span>
                    </div>
                    <p className={styles.commentContent}>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <span className={styles.noComments}>No comments yet. Start the conversation!</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
