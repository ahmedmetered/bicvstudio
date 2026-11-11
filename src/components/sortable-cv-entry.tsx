import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SortableCVEntry({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`entry-editor ${isDragging ? 'is-dragging' : ''}`}>
    <Button variant="ghost" size="icon" className="drag-handle" title={label} aria-label={label} {...attributes} {...listeners}><GripVertical size={14} /></Button>
    {children}
  </div>;
}