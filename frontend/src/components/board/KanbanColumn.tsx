import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Column, Task } from '@/types';
import { TaskCard } from './TaskCard';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: String(column.id),
    data: { column },
  });

  const taskIds = tasks.map((t) => String(t.id));

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.column, isOver && styles.isOver)}
      aria-label={`Column ${column.name}`}
    >
      {/* Column Header */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span
            className={styles.colorPill}
            style={{ backgroundColor: column.color || '#64748B' }}
          />
          <h3 className={styles.title}>{column.name}</h3>
          <span className={styles.countBadge}>{tasks.length}</span>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => onAddTask(String(column.id))}
          title="Add task to column"
          aria-label={`Add task to ${column.name}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task List / Sortable Context */}
      <div className={styles.taskList}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className={styles.emptyState}>
            <span>No tasks yet</span>
          </div>
        )}
      </div>
    </div>
  );
};
