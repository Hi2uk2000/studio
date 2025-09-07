// src/ai/flows/categorize-expenses.ts
'use server';

/**
 * @fileOverview AI-powered expense categorization flow.
 *
 * This file defines a Genkit flow that uses an LLM to automatically categorize
 * expenses based on their description.
 *
 * @exports categorizeExpense - The main function to categorize an expense.
 * @exports CategorizeExpenseInput - The input type for the categorizeExpense function.
 * @exports CategorizeExpenseOutput - The output type for the categorizeExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the expense to categorize.'),
});
export type CategorizeExpenseInput = z.infer<typeof CategorizeExpenseInputSchema>;

const CategorizeExpenseOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the expense (e.g., "Food", "Utilities", "Mortgage").'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level (0 to 1) of the category prediction, where 1 is the highest confidence.'
    ),
});
export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;

export async function categorizeExpense(input: CategorizeExpenseInput): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const categorizeExpensePrompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `You are an AI assistant that categorizes expenses based on their description.

  Given the following expense description, determine the most appropriate category and a confidence level for your prediction.

  Description: {{{description}}}

  Respond with a single JSON object with "category" and "confidence" keys.
  The confidence value should be a number between 0 and 1.
  Possible categories are: Food, Utilities, Mortgage, Transportation, Entertainment, Groceries, Travel, Shopping, Insurance, Other.
`,
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await categorizeExpensePrompt(input);
    return output!;
  }
);
