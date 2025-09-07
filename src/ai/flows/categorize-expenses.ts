// src/ai/flows/categorise-expenses.ts
'use server';

/**
 * @fileOverview AI-powered expense categorisation flow.
 *
 * This file defines a Genkit flow that uses an LLM to automatically categorise
 * expenses based on their description.
 *
 * @exports categoriseExpense - The main function to categorise an expense.
 * @exports CategoriseExpenseInput - The input type for the categoriseExpense function.
 * @exports CategoriseExpenseOutput - The output type for the categoriseExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategoriseExpenseInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the expense to categorise.'),
});
export type CategoriseExpenseInput = z.infer<typeof CategoriseExpenseInputSchema>;

const CategoriseExpenseOutputSchema = z.object({
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
export type CategoriseExpenseOutput = z.infer<typeof CategoriseExpenseOutputSchema>;

export async function categoriseExpense(input: CategoriseExpenseInput): Promise<CategoriseExpenseOutput> {
  return categoriseExpenseFlow(input);
}

const categoriseExpensePrompt = ai.definePrompt({
  name: 'categoriseExpensePrompt',
  input: {schema: CategoriseExpenseInputSchema},
  output: {schema: CategoriseExpenseOutputSchema},
  prompt: `You are an AI assistant that categorises expenses based on their description.

  Given the following expense description, determine the most appropriate category and a confidence level for your prediction.

  Description: {{{description}}}

  Respond with a single JSON object with "category" and "confidence" keys.
  The confidence value should be a number between 0 and 1.
  Possible categories are: Food, Utilities, Mortgage, Transportation, Entertainment, Groceries, Travel, Shopping, Insurance, Other.
`,
});

const categoriseExpenseFlow = ai.defineFlow(
  {
    name: 'categoriseExpenseFlow',
    inputSchema: CategoriseExpenseInputSchema,
    outputSchema: CategoriseExpenseOutputSchema,
  },
  async input => {
    const {output} = await categoriseExpensePrompt(input);
    return output!;
  }
);
