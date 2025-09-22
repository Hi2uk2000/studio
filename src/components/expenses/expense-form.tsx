
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { categoriseExpense } from '@/ai/flows/categorize-expenses';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  includeInSpend: z.boolean().default(true),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  onAddExpense: (expense: { description: string; amount: number; category: string, includeInSpend: boolean }) => void;
}

/**
 * A form for adding a new expense. It includes fields for description and amount,
 * and uses an AI flow to automatically categorize the expense.
 *
 * @param {object} props - The component's props.
 * @param {(expense: { description: string; amount: number; category: string, includeInSpend: boolean }) => void} props.onAddExpense - A callback function to be called when an expense is added.
 * @returns {JSX.Element} The ExpenseForm component.
 */
export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: '', amount: undefined, includeInSpend: true },
  });

  /**
   * Handles the form submission.
   * It calls the AI flow to categorize the expense and then calls the onAddExpense callback.
   * @param {ExpenseFormValues} data - The form data.
   */
  async function onSubmit(data: ExpenseFormValues) {
    setIsLoading(true);
    try {
      const { category } = await categoriseExpense({ description: data.description });
      onAddExpense({ ...data, category });
      toast({
        title: 'Expense Added',
        description: `Categorised as "${category}".`,
      });
      form.reset();
    } catch (error) {
      console.error('Failed to categorise expense:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not categorise expense. Adding as "Other".',
      });
      onAddExpense({ ...data, category: 'Other' });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dinner with friends" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (£)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 45.50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="includeInSpend"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Include in household spend?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Add & Categorise
        </Button>
      </form>
    </Form>
  );
}
