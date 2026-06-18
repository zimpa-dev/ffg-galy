'use server';
/**
 * @fileOverview An AI-powered writing assistant for NGO administrators.
 *
 * - draftContent - A function that handles content drafting for program descriptions, news articles, or campaign appeals.
 * - ContentDraftingInput - The input type for the draftContent function.
 * - ContentDraftingOutput - The return type for the draftContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContentDraftingInputSchema = z.object({
  contentType: z
    .string()
    .describe('The type of content to draft (e.g., "program description", "news article", "campaign appeal").'),
  topic: z.string().describe('The main topic or subject of the content.'),
  keyPoints: z
    .string()
    .optional()
    .describe('Specific information, messages, or calls to action to include in the content.'),
  desiredTone: z
    .string()
    .default('inspirational and professional')
    .describe('The desired tone for the content (e.g., "urgent", "empathetic", "formal", "inspirational").'),
  existingDraft: z
    .string()
    .optional()
    .describe('An optional existing draft to refine or expand upon.'),
});
export type ContentDraftingInput = z.infer<typeof ContentDraftingInputSchema>;

const ContentDraftingOutputSchema = z.object({
  draftedContent: z.string().describe('The AI-generated draft content.'),
});
export type ContentDraftingOutput = z.infer<typeof ContentDraftingOutputSchema>;

export async function draftContent(input: ContentDraftingInput): Promise<ContentDraftingOutput> {
  return aiContentDraftingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContentDraftingAssistantPrompt',
  input: { schema: ContentDraftingInputSchema },
  output: { schema: ContentDraftingOutputSchema },
  prompt: `You are an AI-powered writing assistant for the international humanitarian NGO 'FFG-VE'.
Your goal is to help administrators draft compelling and consistent content for their website.
FFG-VE's slogan is: "Ensemble pour un monde plus solidaire".

The content type requested is: '{{{contentType}}}'.
The main topic for this content is: '{{{topic}}}'.
The desired tone is: '{{{desiredTone}}}'.

{{#if keyPoints}}
Please ensure the following key points and messages are clearly included:
{{{keyPoints}}}
{{/if}}

{{#if existingDraft}}
Here is an existing draft to build upon or refine. Please improve it while maintaining the requested tone and incorporating the key points provided:
---
{{{existingDraft}}}
---
{{else}}
Please draft original content based on the information provided.
{{/if}}

Focus on inspiring action, conveying the impact of FFG-VE's work, and engaging the audience.
The target audience includes potential donors, volunteers, and the general public, so the language should be clear, professional, and impactful.
`,
});

const aiContentDraftingAssistantFlow = ai.defineFlow(
  {
    name: 'aiContentDraftingAssistantFlow',
    inputSchema: ContentDraftingInputSchema,
    outputSchema: ContentDraftingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
