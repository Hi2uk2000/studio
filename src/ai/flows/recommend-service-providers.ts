'use server';

/**
 * @fileOverview AI agent that recommends service providers based on user location and maintenance needs.
 *
 * - recommendServiceProviders - A function that handles the recommendation process.
 * - RecommendServiceProvidersInput - The input type for the recommendServiceProviders function.
 * - RecommendServiceProvidersOutput - The return type for the recommendServiceProviders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendServiceProvidersInputSchema = z.object({
  location: z
    .string()
    .describe('The location of the user, e.g., city and state.'),
  maintenanceNeeds: z
    .string()
    .describe(
      'A description of the maintenance needs, e.g., leaky faucet, electrical issue, etc.'
    ),
});
export type RecommendServiceProvidersInput = z.infer<
  typeof RecommendServiceProvidersInputSchema
>;

const RecommendServiceProvidersOutputSchema = z.object({
  serviceProviders: z
    .array(z.string())
    .describe(
      'A list of recommended service providers based on the location and maintenance needs.'
    ),
});
export type RecommendServiceProvidersOutput = z.infer<
  typeof RecommendServiceProvidersOutputSchema
>;

export async function recommendServiceProviders(
  input: RecommendServiceProvidersInput
): Promise<RecommendServiceProvidersOutput> {
  return recommendServiceProvidersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendServiceProvidersPrompt',
  input: {schema: RecommendServiceProvidersInputSchema},
  output: {schema: RecommendServiceProvidersOutputSchema},
  prompt: `You are a helpful assistant that recommends service providers based on the user's location and maintenance needs.

  Location: {{{location}}}
  Maintenance Needs: {{{maintenanceNeeds}}}

  Please provide a list of service providers that can help with the maintenance needs in the specified location.
  Format the output as a JSON array of strings.
  For example: ["plumber1", "electrician1", "carpenter1"]
  Make sure to only return a JSON array, do not include any other text.`,
});

const recommendServiceProvidersFlow = ai.defineFlow(
  {
    name: 'recommendServiceProvidersFlow',
    inputSchema: RecommendServiceProvidersInputSchema,
    outputSchema: RecommendServiceProvidersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
