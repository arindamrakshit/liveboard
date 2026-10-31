import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { MessageSquare, Calendar, Paperclip } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import type { Task } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { PriorityBadge } from './PriorityBadge';
import { useUIStore } from '@/stores/uiStore';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay = false }) => {
  const { setSelectedTask } = useUIStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isOverdue = task.dueDate ? isPast(parseISO(task.dueDate)) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        styles.card,
        styles[task.priority.toLowerCase()],
        isOverlay && styles.overlay,
        isDragging && styles.dragging
      )}
      onClick={() => setSelectedTask(task.id as any)}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedTask(task.id as any);
        }
      }}
    >
      {/* Priority accent bar */}
      <div className={clsx(styles.accentBar, styles[`accent_${task.priority.toLowerCase()}`])} />

      <div className={styles.body}>
        {/* Labels row */}
        {task.labels && task.labels.length > 0 && (
          <div className={styles.labels}>
            {task.labels.map((label) => (
              <Badge key={label.id} color={label.color} size="sm">
                {label.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h4 className={styles.title}>{task.title}</h4>

        {/* Footer: Due date, comments, assignee */}
        <div className={styles.footer}>
          <div className={styles.meta}>
            {task.dueDate && (
              <span
                className={clsx(styles.dueDate, isOverdue && styles.overdue)}
                title={isOverdue ? 'Overdue!' : 'Due date'}
              >
                <Calendar size={12} />
                <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
              </span>
            )}

            {task.commentCount > 0 && (
              <span className={styles.commentsCount} title={`${task.commentCount} comments`}>
                <MessageSquare size={12} />
                <span>{task.commentCount}</span>
              </span>
            )}
          </div>

          {task.assignee && (
            <Avatar
              name={task.assignee.fullName || task.assignee.username}
              src={task.assignee.avatarUrl}
              size="xs"
            />
          )}
        </div>
      </div>
    </div>
  );
};
