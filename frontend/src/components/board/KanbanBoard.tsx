import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import type { Board, Column, Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useMoveTask } from '@/hooks/useTask';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  board: Board;
  filterQuery?: string;
  filterPriority?: string;
  sortBy?: string;
  onAddTask: (columnId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  board,
  filterQuery = '',
  filterPriority = 'ALL',
  sortBy = 'DEFAULT',
  onAddTask,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTaskMutation = useMoveTask(String(board.projectId));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    // Find active task's original column
    let sourceColId = '';
    let foundTask: Task | undefined;
    for (const col of board.columns) {
      const t = col.tasks.find((item) => String(item.id) === activeTaskId);
      if (t) {
        sourceColId = String(col.id);
        foundTask = t;
        break;
      }
    }

    if (!foundTask) return;

    // Check if dropped onto a column or onto another task
    let targetColId = '';
    let newPosition = 1000;

    const targetColumn = board.columns.find((col) => String(col.id) === overId);
    if (targetColumn) {
      targetColId = String(targetColumn.id);
      const targetTasks = targetColumn.tasks;
      newPosition = targetTasks.length > 0 ? targetTasks[targetTasks.length - 1].position + 1000 : 1000;
    } else {
      // Dropped onto another task
      for (const col of board.columns) {
        const overTaskIndex = col.tasks.findIndex((t) => String(t.id) === overId);
        if (overTaskIndex !== -1) {
          targetColId = String(col.id);
          const prevTask = col.tasks[overTaskIndex - 1];
          const currTask = col.tasks[overTaskIndex];
          if (prevTask) {
            newPosition = (prevTask.position + currTask.position) / 2;
          } else {
            newPosition = currTask.position / 2;
          }
          break;
        }
      }
    }

    if (targetColId) {
      moveTaskMutation.mutate({
        taskId: activeTaskId,
        columnId: targetColId,
        position: newPosition,
      });
    }
  };

  // Filter and sort tasks for each column
  const getProcessedTasks = (tasks: Task[]) => {
    return tasks
      .filter((task) => {
        const matchesQuery =
          !filterQuery ||
          task.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(filterQuery.toLowerCase());
        const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
        return matchesQuery && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'PRIORITY') {
          const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
        }
        if (sortBy === 'DUE_DATE') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.position - b.position;
      });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.boardContainer}>
        {board.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getProcessedTasks(column.tasks)}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
