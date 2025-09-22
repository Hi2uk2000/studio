// src/app/expenses/add-recurring/page.tsx
'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { categoriseExpense } from '@/ai/flows/categorize-expenses';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  description: z.string().min(3, 'Description is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  frequency: z.enum(['monthly', 'yearly']),
  startDate: z.date({ required_error: 'A start date is required.' }),
  term: z.coerce.number().positive('Term must be a positive number.'),
  termUnit: z.enum(['months', 'years']),
});

type RecurringBillFormValues = z.infer<typeof formSchema>;

/**
 * The page for adding a new recurring bill.
 *
 * @returns {JSX.Element} The AddRecurringBillPage component.
 */
export default function AddRecurringBillPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RecurringBillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        frequency: 'monthly',
        termUnit: 'months',
    },
  });

  /**
   * Handles the form submission.
   *
   * @param {RecurringBillFormValues} data - The form data.
   */
  async function onSubmit(data: RecurringBillFormValues) {
    setIsLoading(true);
    try {
      // In a real app, you'd save this data to your database
      const { category } = await categoriseExpense({ description: data.description });
      const newBill = { ...data, category };
      console.log('New Recurring Bill:', newBill);

      toast({
        title: 'Recurring Bill Added',
        description: `"${data.description}" has been added and categorised as "${category}".`,
      });
      router.push('/expenses');
    } catch (error) {
      console.error('Failed to add recurring bill:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the recurring bill. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add a Recurring Bill</CardTitle>
          <CardDescription>
            Use this form to add a new recurring payment like a utility bill, subscription, or insurance premium.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electricity Bill" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount (£)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g., 55.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Payment Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? format(field.value, 'd MMM yyyy') : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                  <div className="md:col-span-1">
                     <FormField
                        control={form.control}
                        name="term"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Term</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 12" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div className="md:col-span-1">
                     <FormField
                        control={form.control}
                        name="termUnit"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Term Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="months">Months</SelectItem>
                                <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
               </div>
              
              <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" asChild>
                      <Link href="/expenses">Cancel</Link>
                  </Button>
                  <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Add Recurring Bill
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
