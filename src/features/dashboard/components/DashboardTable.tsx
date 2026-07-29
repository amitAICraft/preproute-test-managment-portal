import { Edit, Eye, Trash2 } from 'lucide-react';
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
import { formatDate } from '@/lib/utils';
import type { Test, TestStatus } from '@/features/tests';
import { DASHBOARD_MESSAGES, TEST_STATUS_BADGE_VARIANT } from '@/features/tests';

interface DashboardTableProps {
  tests: Test[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  /** `undefined` signals the delete API is unavailable — button is disabled. */
  onDelete?: (id: string) => void;
}

/**
 * DashboardTable — renders the tests list.
 *
 * - All strings come from DASHBOARD_MESSAGES constants.
 * - Status variant mapping is a constant lookup (no inline logic).
 * - Delete is disabled when `onDelete` is undefined.
 * - Every icon-only button has an accessible aria-label.
 */
export function DashboardTable({ tests, onEdit, onView, onDelete }: DashboardTableProps) {
  const getVariant = (status: string) =>
    TEST_STATUS_BADGE_VARIANT[status as TestStatus] ?? 'secondary';

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="overflow-x-auto">
        <Table aria-label="Tests list">
          <TableHeader>
            <TableRow>
              <TableHead>{DASHBOARD_MESSAGES.TABLE.COL_NAME}</TableHead>
              <TableHead>{DASHBOARD_MESSAGES.TABLE.COL_SUBJECT}</TableHead>
              <TableHead>{DASHBOARD_MESSAGES.TABLE.COL_STATUS}</TableHead>
              <TableHead>{DASHBOARD_MESSAGES.TABLE.COL_DATE}</TableHead>
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

                    {/* Delete — disabled if mutation is unavailable */}
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!onDelete}
                      onClick={() => onDelete?.(test.id)}
                      aria-label={
                        onDelete
                          ? `${DASHBOARD_MESSAGES.ACTIONS.DELETE}: ${test.title}`
                          : DASHBOARD_MESSAGES.ACTIONS.DELETE_UNAVAILABLE
                      }
                      title={
                        onDelete
                          ? DASHBOARD_MESSAGES.ACTIONS.DELETE
                          : DASHBOARD_MESSAGES.ACTIONS.DELETE_UNAVAILABLE
                      }
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
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
