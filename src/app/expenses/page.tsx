// src/app/expenses/page.tsx
'use client';
import { useState } from 'react';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, UploadCloud, Loader2 } from 'lucide-react';
import RecurringBillsTable from '@/components/expenses/recurring-bills-table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { extractExpensesFromStatement } from '@/ai/flows/extract-expenses-from-statement';
import { Label } from '@/components/ui/label';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  includeInSpend: boolean;
}

export interface RecurringBill {
  id: string;
  description: string;
  amount: number;
  category: string;
  frequency: 'monthly' | 'yearly';
  startDate: string;
  term: number; // e.g., 12 (for 12 months or years)
  termUnit: 'months' | 'years';
}

const initialExpenses: Expense[] = [
    { id: '1', description: 'Monthly Mortgage', amount: 1200, category: 'Mortgage', date: new Date().toISOString(), includeInSpend: true },
    { id: '2', description: 'Electricity Bill', amount: 75.50, category: 'Utilities', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), includeInSpend: true },
    { id: '3', description: 'Grocery Shopping', amount: 120.30, category: 'Groceries', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), includeInSpend: true },
];

const initialRecurringBills: RecurringBill[] = [
    { id: '1', description: 'Council Tax', amount: 180, category: 'Utilities', frequency: 'monthly', startDate: '2024-04-01', term: 10, termUnit: 'months' },
    { id: '2', description: 'Home Insurance', amount: 450, category: 'Insurance', frequency: 'yearly', startDate: '2024-01-15', term: 1, termUnit: 'years' },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(initialRecurringBills);
  const [statementText, setStatementText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const handleExtractExpenses = async () => {
    if (!statementText.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Statement content cannot be empty.' });
        return;
    }
    setIsExtracting(true);
    try {
        const result = await extractExpensesFromStatement({ statement: statementText });
        const newExpenses = result.expenses.map((exp, index) => ({
            ...exp,
            id: `statement-${Date.now()}-${index}`,
            date: new Date().toISOString(),
            includeInSpend: true,
        }));
        setExpenses(prev => [...newExpenses, ...prev]);
        toast({
            title: 'Extraction Complete',
            description: `Successfully extracted and added ${newExpenses.length} expenses.`,
        });
        setStatementText('');
    } catch (error) {
        console.error('Failed to extract expenses from statement:', error);
        toast({ variant: 'destructive', title: 'Extraction Failed', description: 'Could not extract expenses. Please check the statement format.' });
    } finally {
        setIsExtracting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Tracking</h1>
          <Button asChild>
            <Link href="/expenses/add-recurring">
              <Plus className="mr-2 h-4 w-4" /> Add Recurring Bill
            </Link>
          </Button>
      </div>

      <Tabs defaultValue="one-off" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="one-off">One-off Expenses</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Bills</TabsTrigger>
        </TabsList>
        <TabsContent value="one-off">
            <div className="grid gap-8 lg:grid-cols-3 mt-6">
                <div className="lg:col-span-1 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Expense</CardTitle>
                      <CardDescription>Enter details and let AI categorise it for you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExpenseForm onAddExpense={addExpense} />
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader>
                      <CardTitle>Import from Statement</CardTitle>
                      <CardDescription>Paste the content of a bank or credit card statement to automatically extract expenses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="statement-input">Paste Statement Content</Label>
                            <Textarea
                                id="statement-input"
                                value={statementText}
                                onChange={(e) => setStatementText(e.target.value)}
                                placeholder="Paste your statement text here. The AI will parse the transactions, categorise them, and add them to your expense history."
                                rows={8}
                                disabled={isExtracting}
                            />
                        </div>
                        <Button onClick={handleExtractExpenses} disabled={isExtracting} className="w-full">
                            {isExtracting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <UploadCloud className="mr-2 h-4 w-4" />
                            )}
                            Extract Expenses
                        </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                   <Card>
                    <CardHeader>
                      <CardTitle>Expense History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ExpenseTable expenses={expenses} />
                    </CardContent>
                  </Card>
                </div>
            </div>
        </TabsContent>
         <TabsContent value="recurring">
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Recurring Bills</CardTitle>
                    <CardDescription>A list of your monthly and yearly recurring payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RecurringBillsTable bills={recurringBills} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
