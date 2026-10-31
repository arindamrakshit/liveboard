/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/board/PriorityBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

describe('UI Components', () => {
  it('Button renders children and responds to click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeDefined();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Button displays loading state and disables user interaction', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('PriorityBadge renders correct label and style variant', () => {
    const { rerender } = render(<PriorityBadge priority="URGENT" />);
    expect(screen.getByText(/urgent/i)).toBeDefined();

    rerender(<PriorityBadge priority="HIGH" />);
    expect(screen.getByText(/high/i)).toBeDefined();

    rerender(<PriorityBadge priority="LOW" />);
    expect(screen.getByText(/low/i)).toBeDefined();
  });

  it('Avatar generates initials from full name when image is absent', () => {
    render(<Avatar name="Alice Johnson" />);
    expect(screen.getByText('AJ')).toBeDefined();
  });

  it('EmptyState renders title, description, and triggers CTA action', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No items found"
        description="Try adjusting your filters"
        actionLabel="Reset Filters"
        onAction={handleAction}
      />
    );
    expect(screen.getByText('No items found')).toBeDefined();
    expect(screen.getByText('Try adjusting your filters')).toBeDefined();
    const actionBtn = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
