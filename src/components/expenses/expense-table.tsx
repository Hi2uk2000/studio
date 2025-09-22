
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Expense } from '@/app/expenses/page';
import { CheckCircle, XCircle } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
}

/**
 * Renders a table of expenses.
 *
 * @param {object} props - The component's props.
 * @param {Expense[]} props.expenses - An array of expense objects to display.
 * @returns {JSX.Element} The ExpenseTable component.
 */
export function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Included in Spend</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{new Date(expense.date).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{expense.category}</Badge>
                </TableCell>
                 <TableCell className="flex items-center gap-2">
                  {expense.includeInSpend 
                    ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                    : <XCircle className="h-5 w-5 text-muted-foreground" />}
                </TableCell>
                <TableCell className="text-right font-mono">
                  £{expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No expenses added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
