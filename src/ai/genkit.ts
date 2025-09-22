import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * The Genkit AI instance, configured with the Google AI plugin.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
