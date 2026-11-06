export default {
  id: 'file-upload-security-designer',
  createdAt: '2026-10-20',
  name: 'File Upload Security Designer',
  description:
    'Design secure file uploads with validation, storage isolation, scanning, processing, access control, and lifecycle rules.',
  category: 'Engineering',
  icon: 'UploadCloud',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'usecase',
      label: 'Upload use case',
      type: 'textarea',
      placeholder: 'Describe who uploads what, where it is stored, and how it is used...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack and controls',
      type: 'textarea',
      placeholder: 'List framework, storage, scanning, and access patterns...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State size, latency, privacy, or compliance limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an application security engineer.

Create a secure upload design for the stated use case, covering malicious files, content-type confusion, storage exposure, and safe processing.

Output format:

## Threat Model
- Untrusted users and file sources.\n- Malware, polyglots, and decompression bombs.\n- Data leakage and stored XSS.

## Validation
- Size, count, and type limits.\n- Content inspection beyond extension and MIME.\n- Filename and metadata handling.

## Storage Isolation
- Object storage outside the webroot.\n- Per-tenant prefixes and access policies.\n- Encryption and versioning.

## Scanning and Processing
- Malware scanning and quarantine.\n- Image and document transformation.\n- Sandboxing and resource limits.

## Access and Lifecycle
- Signed URLs and authorization checks.\n- Retention, deletion, and legal hold.\n- Audit logs and abuse monitoring.

Rules:
- Never trust the filename, extension, or client-supplied MIME type.
- Store uploads outside the webroot and serve them through controlled access.
- Scan and process files in an isolated path with resource limits.`,

  outputType: 'markdown',
}
