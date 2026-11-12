import { ShieldCheck, Lock, Database, Eye, Globe, Mail, RefreshCw, ArrowLeft } from 'lucide-react'

const sections = [
  {
    icon: ShieldCheck,
    title: 'Information We Collect',
    content:
      'OpenAgents collects only the information necessary to operate and improve the platform. This may include account information (when provided), workflow configurations, technical information such as browser type, and anonymous usage statistics.',
  },
  {
    icon: Database,
    title: 'Cookies & Local Storage',
    content:
      "OpenAgents uses your browser's local storage to improve your experience. For example, recently viewed agents and certain user preferences may be stored locally on your device. This information stays in your browser and can be cleared at any time through your browser settings.",
  },
  {
    icon: Globe,
    title: 'Network Activity',
    content:
      'Typefaces and styles are served from the same origin as the application, so opening a page does not contact a third-party font service. Requests to an AI provider occur only when you run an agent with the API key you supply. Optional cloud features contact the configured backend only when you use them.',
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content:
      'Information collected through the platform is used to provide core functionality, improve performance, troubleshoot issues, understand feature usage, and enhance future releases. We do not sell your personal information.',
  },
  {
    icon: Lock,
    title: 'Data Security',
    content:
      'Reasonable technical and organizational safeguards are implemented to protect information from unauthorized access, disclosure, or misuse. While no online service can guarantee absolute security, we continuously work to strengthen our security practices.',
  },
  {
    icon: ShieldCheck,
    title: 'Your Privacy Rights',
    content:
      'You may clear browser-stored data, including local storage, at any time using your browser settings. Where applicable, users may request access to, correction of, or deletion of personal information collected by the platform.',
  },
  {
    icon: Globe,
    title: 'Third-Party Services',
    content:
      'OpenAgents may integrate with third-party AI providers, APIs, or external services. Those services operate under their own privacy policies and terms, and users should review them before sharing information.',
  },
  {
    icon: RefreshCw,
    title: 'Policy Updates',
    content:
      "This Privacy Policy may be updated periodically to reflect new features, improvements, or legal requirements. The 'Last Updated' date at the top of this page indicates the most recent revision.",
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content:
      'If you have questions about this Privacy Policy or how your information is handled, please contact the project maintainers by opening an issue or discussion on the official GitHub repository.',
  },
]

import LegalDoc from '../components/layout/LegalDoc'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Privacy() {
  useDocumentTitle('Privacy Policy')

  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 2026"
      intro="Your privacy matters. This policy explains what OpenAgents collects, how that information is used, how browser storage works, the rights you have over your data, and the measures taken to protect it."
      sections={sections}
      footerTitle="Transparency and trust"
      footerBody="We're committed to an open-source AI ecosystem built on transparency, security and user control. As the platform evolves, this policy may be updated to reflect new features, changes in data practices, or legal requirements. Continued use after an update constitutes acceptance of the revised policy."
    />
  )
}
