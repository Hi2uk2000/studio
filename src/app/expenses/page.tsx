
'use client';
import { useState } from 'react';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  includeInSpend: boolean;
}

const initialExpenses: Expense[] = [
    { id: '1', description: 'Monthly Mortgage', amount: 1200, category: 'Mortgage', date: new Date().toISOString(), includeInSpend: true },
    { id: '2', description: 'Electricity Bill', amount: 75.50, category: 'Utilities', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), includeInSpend: true },
    { id: '3', description: 'Grocery Shopping', amount: 120.30, category: 'Groceries', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), includeInSpend: true },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Tracking</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Enter details and let AI categorize it for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm onAddExpense={addExpense} />
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
    </div>
  );
}
