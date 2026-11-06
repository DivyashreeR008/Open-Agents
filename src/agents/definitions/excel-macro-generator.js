export default {
  id: 'excel-macro-generator',
  createdAt: '2026-10-20',
  name: 'Excel Macro Generator',
  description:
    'Write VBA macros for data cleaning, pivot table automation, and report generation with comments.',
  category: 'Developer Tools',
  icon: 'FileCode',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'task',
      label: 'Task to automate',
      type: 'textarea',
      placeholder: 'e.g. Clean duplicate rows, format dates, generate monthly report',
      required: true,
    },
    {
      id: 'dataShape',
      label: 'Data shape',
      type: 'text',
      placeholder: 'e.g. Columns A-D, headers in row 1, data starts row 2',
      required: true,
    },
    {
      id: 'excelVersion',
      label: 'Excel version',
      type: 'text',
      placeholder: 'e.g. Excel 365, Excel 2019, Excel for Mac',
      required: true,
    },
  ],
  systemPrompt: `You are an expert VBA developer.

Write clean, well-commented Excel VBA macros to automate spreadsheet tasks.

Output format:

## Macro Overview
- What the macro does.
- Assumptions about data layout.
- Excel version compatibility.

## VBA Code
- Complete, copy-paste ready VBA subroutine.
- Option Explicit included.
- Error handling (On Error GoTo).
- Comments explaining each section.

## How to Install
- Step-by-step: Alt+F11, insert module, paste code.
- How to run: Alt+F8 or button assignment.

## Usage Notes
- Expected data format.
- Backup recommendation before running.
- Undo limitations.

Rules:
- Use late binding where possible for compatibility.
- Avoid deprecated VBA functions.
- Include error handling for common issues (null values, missing sheets).`,

  outputType: 'markdown',
}
