import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// ------ Dialog --------------------

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

//Reusable modal dialog built on the native `<dialog>` element.
export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Scroll-lock on body while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle native `close` event (ESC key fires this)
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleClose = () => onOpenChange(false);
    el.addEventListener('close', handleClose);
    return () => el.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  // Handle backdrop click (click on the `<dialog>` itself, not its children)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    },
    [onOpenChange],
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 m-auto max-h-[90vh] w-full rounded-2xl border border-slate-200 bg-white p-0 shadow-xl',
        'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
        'open:animate-in open:fade-in-0 open:zoom-in-95',
        'max-w-4xl',
        className,
      )}
      aria-modal="true"
    >
      <div className="flex max-h-[90vh] flex-col">{children}</div>
    </dialog>
  );
}

// ------------------DialogHeader---------------------------

interface DialogHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
}

//Standard dialog header with title and close button.

export function DialogHeader({ title, onClose, className }: DialogHeaderProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between border-b border-slate-100 px-8 py-5',
        className,
      )}
    >
      <h2 className="text-lg font-medium text-slate-800">{title}</h2>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600"
        aria-label="Close dialog"
      >
        <X className="size-5" />
      </Button>
    </div>
  );
}

// ------- DialogBody -----------------------

interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

// Scrollable content area inside the dialog.

export function DialogBody({ children, className }: DialogBodyProps) {
  return <div className={cn('flex-1 overflow-y-auto px-8 py-6', className)}>{children}</div>;
}

// -------------------- DialogFooter --------------------------

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

// Standard dialog footer for action buttons.
export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-4 border-t border-slate-100 px-8 py-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
