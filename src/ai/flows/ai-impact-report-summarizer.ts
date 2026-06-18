'use server';
/**
 * @fileOverview An AI agent that summarizes NGO impact reports and financial statements.
 *
 * - summarizeImpactReport - A function that handles the summarization process.
 * - ImpactReportSummaryInput - The input type for the summarizeImpactReport function.
 * - ImpactReportSummaryOutput - The return type for the summarizeImpactReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the summarization flow
const ImpactReportSummaryInputSchema = z.object({
  reportContent: z
    .string()
    .describe(
      'The full text content of the NGO\'s annual impact report or financial statement.'
    ),
});
export type ImpactReportSummaryInput = z.infer<typeof ImpactReportSummaryInputSchema>;

// Output schema for the summarization flow
const ImpactReportSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the report, highlighting key insights, fund utilization, and transparency.'
    ),
});
export type ImpactReportSummaryOutput = z.infer<typeof ImpactReportSummaryOutputSchema>;

// Wrapper function to call the Genkit flow
export async function summarizeImpactReport(
  input: ImpactReportSummaryInput
): Promise<ImpactReportSummaryOutput> {
  return aiImpactReportSummarizerFlow(input);
}

// Define the prompt for the AI model
const summarizeImpactReportPrompt = ai.definePrompt({
  name: 'summarizeImpactReportPrompt',
  input: {schema: ImpactReportSummaryInputSchema},
  output: {schema: ImpactReportSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing NGO reports for donors and concerned citizens.
Your task is to provide a concise and easy-to-understand summary of the provided NGO document (either an annual impact report or a financial statement).

Focus on the following key aspects:
1.  **Main Achievements and Impact:** What were the primary accomplishments and the overall impact of the NGO's work?
2.  **Fund Utilization:** How were the funds utilized? Provide a breakdown or percentages if available (e.g., what percentage went to programs, administration, fundraising).
3.  **Transparency:** What information is provided regarding financial transparency, accountability, and governance? Highlight any measures taken to ensure transparency.

Ensure the summary is clear, objective, and directly addresses the concerns of a donor or concerned citizen looking to quickly grasp key insights and verify the organization's transparency.

Document Content:
{{{reportContent}}}`,
});

// Define the Genkit flow
const aiImpactReportSummarizerFlow = ai.defineFlow(
  {
    name: 'aiImpactReportSummarizerFlow',
    inputSchema: ImpactReportSummaryInputSchema,
    outputSchema: ImpactReportSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeImpactReportPrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary.');
    }
    return output;
  }
);
