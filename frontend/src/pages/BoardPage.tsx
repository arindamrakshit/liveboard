import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  ArrowUpDown,
  Settings,
  Users,
  Search,
  FolderKanban,
} from 'lucide-react';
import { useBoard } from '@/hooks/useBoard';
import { useProject } from '@/hooks/useProjects';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { SkeletonBoard } from '@/components/ui/Skeleton';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { CreateTaskModal } from '@/components/board/CreateTaskModal';
import { TaskDetailModal } from '@/components/board/TaskDetailModal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './BoardPage.module.css';

export const BoardPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { board, isLoading, refetch } = useBoard(id);
  const { data: project } = useProject(id);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  // Modals state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskColumnId, setCreateTaskColumnId] = useState<string>('');
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleOpenCreateTask = (columnId: string) => {
    setCreateTaskColumnId(columnId);
    setIsCreateTaskOpen(true);
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    setIsAddingColumn(true);
    try {
      await api.post(`/projects/${id}/columns`, { name: newColumnName.trim() });
      toast.success('Column created');
      setNewColumnName('');
      setIsAddColumnOpen(false);
      refetch();
    } catch {
      toast.error('Failed to create column');
    } finally {
      setIsAddingColumn(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: project?.name || 'Board' },
  ];

  return (
    <div className={styles.container}>
      <Topbar breadcrumbs={breadcrumbs} />

      {/* Board Header & Controls */}
      <div className={styles.boardHeader}>
        <div className={styles.projectInfo}>
          <div className={styles.titleRow}>
            <span
              className={styles.colorDot}
              style={{ backgroundColor: project?.color || '#3B82F6' }}
            />
            <h2 className={styles.projectName}>{project?.name || 'Project Board'}</h2>
          </div>
          {project?.description && (
            <p className={styles.projectDesc}>{project.description}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings size={15} />}
            onClick={() => navigate(`/projects/${id}/settings`)}
          >
            Settings
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              const firstColId = board?.columns[0]?.id ? String(board.columns[0].id) : '';
              handleOpenCreateTask(firstColId);
            }}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Filter tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <Filter size={14} className={styles.filterIcon} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={styles.select}
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className={styles.filterItem}>
            <ArrowUpDown size={14} className={styles.filterIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="DEFAULT">Custom Order</option>
              <option value="PRIORITY">Priority</option>
              <option value="DUE_DATE">Due Date</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsAddColumnOpen(true)}
          >
            Add Column
          </Button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className={styles.boardBody}>
        {isLoading || !board ? (
          <div className={styles.skeletonWrapper}>
            <SkeletonBoard />
          </div>
        ) : (
          <KanbanBoard
            board={board}
            filterQuery={searchQuery}
            filterPriority={priorityFilter}
            sortBy={sortBy}
            onAddTask={handleOpenCreateTask}
          />
        )}
      </div>

      {/* Create Task Modal */}
      {board && (
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          projectId={id}
          defaultColumnId={createTaskColumnId}
          columns={board.columns}
        />
      )}

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        title="Create New Column"
        description="Add a workflow stage to this project board."
        maxWidth="sm"
      >
        <form onSubmit={handleAddColumn} className={styles.columnForm}>
          <Input
            label="Column Name"
            placeholder="e.g. In Review, QA, Backlog"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            autoFocus
          />
          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={() => setIsAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isAddingColumn}>
              Create Column
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Details Modal (Slide-in) */}
      <TaskDetailModal projectId={id} />
    </div>
  );
};
