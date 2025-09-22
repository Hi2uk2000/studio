// src/components/expenses/recurring-bills-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RecurringBill } from '@/app/expenses/page';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RecurringBillsTableProps {
  bills: RecurringBill[];
}

/**
 * Renders a table of recurring bills, including their next due date and status.
 *
 * @param {object} props - The component's props.
 * @param {RecurringBill[]} props.bills - An array of recurring bill objects to display.
 * @returns {JSX.Element} The RecurringBillsTable component.
 */
export default function RecurringBillsTable({ bills }: RecurringBillsTableProps) {
  /**
   * Calculates the next due date for a recurring bill.
   *
   * @param {RecurringBill} bill - The recurring bill.
   * @returns {Date} The next due date.
   */
  const getNextDueDate = (bill: RecurringBill): Date => {
      const startDate = new Date(bill.startDate);
      const now = new Date();
      let nextDate = new Date(startDate);

      if (bill.frequency === 'monthly') {
          while(nextDate < now) {
              nextDate.setMonth(nextDate.getMonth() + 1);
          }
      } else { // yearly
           while(nextDate < now) {
              nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
      }
      return nextDate;
  }

  /**
   * Checks if the term for a recurring bill has ended.
   *
   * @param {RecurringBill} bill - The recurring bill.
   * @returns {boolean} `true` if the term has ended, otherwise `false`.
   */
  const isTermEnded = (bill: RecurringBill): boolean => {
      const startDate = new Date(bill.startDate);
      const endDate = new Date(startDate);
      if (bill.termUnit === 'months') {
          endDate.setMonth(startDate.getMonth() + bill.term);
      } else {
          endDate.setFullYear(startDate.getFullYear() + bill.term);
      }
      return new Date() > endDate;
  }


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Next Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length > 0 ? (
            bills.map((bill) => {
              const ended = isTermEnded(bill);
              const nextDueDate = getNextDueDate(bill);
              return (
              <TableRow key={bill.id} className={cn(ended && 'text-muted-foreground opacity-60')}>
                <TableCell className="font-medium">{bill.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{bill.category}</Badge>
                </TableCell>
                <TableCell className="font-mono">£{bill.amount.toFixed(2)}</TableCell>
                 <TableCell className="capitalize">{bill.frequency}</TableCell>
                 <TableCell>{bill.term} {bill.termUnit}</TableCell>
                 <TableCell>
                    {ended ? 'N/A' : format(nextDueDate, 'd MMM yyyy', { locale: enGB })}
                 </TableCell>
                <TableCell>
                   <Badge variant={ended ? "outline" : "default"}>
                       {ended ? 'Ended' : 'Active'}
                    </Badge>
                </TableCell>
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No recurring bills added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
