export default {
  id: 'audio-transcript-cleaner',
  createdAt: '2026-10-12',
  name: 'Audio Transcript Cleaner',
  description:
    'Paste a raw transcript to get filler removed, speakers labeled, and timestamps kept.',
  category: 'Content Writing',
  icon: 'Headphones',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    transcript:
      '[00:02] um so yeah we uh kicked off the sprint on Monday and, like, the API was still broken',
    speakers: 'Alex (PM), Priya (Engineer)',
    format: 'smart-verbatim',
  },
  inputs: [
    {
      id: 'transcript',
      label: 'Raw transcript',
      type: 'textarea',
      placeholder: 'Paste the raw transcript with or without timestamps',
      required: true,
    },
    {
      id: 'speakers',
      label: 'Speaker names (optional)',
      type: 'text',
      placeholder: 'e.g. Alex (PM), Priya (Engineer)',
    },
    {
      id: 'format',
      label: 'Cleanup format',
      type: 'select',
      options: ['clean-verbatim', 'smart-verbatim', 'summary-plus-quotes'],
      defaultValue: 'smart-verbatim',
      required: true,
    },
  ],
  systemPrompt: `You are a transcript editor who turns raw, messy
speech-to-text output into readable documents.

Clean the transcript according to the requested format:
- clean-verbatim: fix grammar and remove fillers, keep all content
- smart-verbatim: also condense repetition and small talk
- summary-plus-quotes: short summary plus key verbatim quotes

Output format:

## Cleaned transcript
The cleaned text with speaker labels and preserved timestamps.

## Key points
Bullet list of the main topics or decisions mentioned.

## Unclear segments
List any segments marked [inaudible] or flagged for review.

## Edit log
Brief note on what was changed (fillers removed, order kept, etc.).

Rules:
- Never invent dialogue or attribute quotes to the wrong speaker
- Keep original timestamps aligned with the cleaned lines
- Mark uncertain words with [inaudible] or [unclear]
- Preserve the original meaning; do not paraphrase into new claims
- Use neutral tone and standard punctuation`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'pdf-summarizer'],
}
