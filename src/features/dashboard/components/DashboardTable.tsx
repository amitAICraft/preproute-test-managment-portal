import { Edit, Eye, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, cn } from '@/lib/utils';
import type { Test, TestStatus } from '@/features/tests';
import { DASHBOARD_MESSAGES, TEST_STATUS_BADGE_VARIANT } from '@/features/tests';

interface DashboardTableProps {
  tests: Test[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  /** `undefined` signals the delete API is unavailable — button is disabled. */
  onDelete?: (id: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

// DashboardTable — renders the tests list.

export function DashboardTable({
  tests,
  onEdit,
  onView,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: DashboardTableProps) {
  const getVariant = (status: string) =>
    TEST_STATUS_BADGE_VARIANT[status as TestStatus] ?? 'secondary';

  const renderSortHeader = (label: string, field: string) => {
    if (!onSort) return label;
    const isActive = sortBy === field;
    return (
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold hover:text-[#7489FF] focus:outline-none cursor-pointer uppercase tracking-wider select-none",
          isActive ? "text-[#7489FF]" : "text-slate-500"
        )}
      >
        {label}
        {isActive ? (
          sortOrder === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    );
  };

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="overflow-x-auto">
        <Table aria-label="Tests list">
          <TableHeader>
            <TableRow>
              <TableHead>{renderSortHeader(DASHBOARD_MESSAGES.TABLE.COL_NAME, 'title')}</TableHead>
              <TableHead>{renderSortHeader(DASHBOARD_MESSAGES.TABLE.COL_SUBJECT, 'subject')}</TableHead>
              <TableHead>{renderSortHeader(DASHBOARD_MESSAGES.TABLE.COL_STATUS, 'status')}</TableHead>
              <TableHead>{renderSortHeader(DASHBOARD_MESSAGES.TABLE.COL_DATE, 'createdAt')}</TableHead>
              <TableHead className="text-right">{DASHBOARD_MESSAGES.TABLE.COL_ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.title}</TableCell>
                <TableCell>{test.subject || DASHBOARD_MESSAGES.TABLE.NO_SUBJECT}</TableCell>
                <TableCell>
                  <Badge variant={getVariant(test.status)} className="capitalize">
                    {test.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(test.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1" role="group" aria-label="Test actions">
                    {/* View */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(test.id)}
                      aria-label={`${DASHBOARD_MESSAGES.ACTIONS.VIEW}: ${test.title}`}
                      title={DASHBOARD_MESSAGES.ACTIONS.VIEW}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(test.id)}
                      aria-label={`${DASHBOARD_MESSAGES.ACTIONS.EDIT}: ${test.title}`}
                      title={DASHBOARD_MESSAGES.ACTIONS.EDIT}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    {/* Delete — disabled since delete API is unavailable */}
                    <span
                      title="Delete functionality is currently unavailable because the backend API does not support deleting tests."
                      className="inline-block"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        aria-label={DASHBOARD_MESSAGES.ACTIONS.DELETE_UNAVAILABLE}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
