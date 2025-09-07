'use server';

/**
 * @fileOverview AI-powered expense extraction from a statement.
 *
 * This file defines a Genkit flow that uses an LLM to automatically extract
 * transactions from a raw text statement and categorise them.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractExpensesInputSchema = z.object({
  statement: z.string().describe('The raw text content of the financial statement.'),
});
export type ExtractExpensesInput = z.infer<typeof ExtractExpensesInputSchema>;

const ExpenseSchema = z.object({
  description: z.string().describe('The description of the expense transaction.'),
  amount: z.number().describe('The monetary value of the transaction.'),
  category: z.string().describe('The predicted category for the expense (e.g., "Food", "Utilities", "Shopping").'),
});

const ExtractExpensesOutputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe('An array of extracted expense objects.'),
});
export type ExtractExpensesOutput = z.infer<typeof ExtractExpensesOutputSchema>;


export async function extractExpensesFromStatement(input: ExtractExpensesInput): Promise<ExtractExpensesOutput> {
  return extractExpensesFlow(input);
}

const extractExpensesPrompt = ai.definePrompt({
  name: 'extractExpensesPrompt',
  input: { schema: ExtractExpensesInputSchema },
  output: { schema: ExtractExpensesOutputSchema },
  prompt: `You are an AI assistant that extracts and categorises expenses from a raw text statement.
  
  Analyse the following statement content. Identify each transaction, extracting its description and amount.
  Also, determine the most appropriate category for each transaction.

  Statement Content:
  {{{statement}}}

  Respond with a single JSON object containing an "expenses" key, which holds an array of objects.
  Each object in the array should have "description", "amount", and "category" keys.
  The amount should be a number. Do not include credit or income transactions, only debits/expenses.
  Possible categories are: Food, Utilities, Mortgage, Transportation, Entertainment, Groceries, Travel, Shopping, Insurance, Other.
`,
});

const extractExpensesFlow = ai.defineFlow(
  {
    name: 'extractExpensesFlow',
    inputSchema: ExtractExpensesInputSchema,
    outputSchema: ExtractExpensesOutputSchema,
  },
  async (input) => {
    const { output } = await extractExpensesPrompt(input);
    return output!;
  }
);
