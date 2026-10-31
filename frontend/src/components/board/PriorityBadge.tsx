import React from 'react';
import type { Priority } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  switch (priority) {
    case 'URGENT':
      return (
        <Badge variant="danger" size={size}>
          <AlertCircle size={size === 'sm' ? 12 : 14} />
          Urgent
        </Badge>
      );
    case 'HIGH':
      return (
        <Badge variant="warning" size={size}>
          <ArrowUp size={size === 'sm' ? 12 : 14} />
          High
        </Badge>
      );
    case 'MEDIUM':
      return (
        <Badge variant="primary" size={size}>
          <ArrowUp size={size === 'sm' ? 12 : 14} />
          Medium
        </Badge>
      );
    case 'LOW':
      return (
        <Badge variant="default" size={size}>
          <ArrowDown size={size === 'sm' ? 12 : 14} />
          Low
        </Badge>
      );
    default:
      return null;
  }
};
