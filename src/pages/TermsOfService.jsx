import {
  FileText,
  Users,
  ShieldAlert,
  Copyright,
  Ban,
  RefreshCw,
  Mail,
  ArrowLeft,
} from 'lucide-react'

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content:
      'By accessing or using OpenAgents, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the platform.',
  },
  {
    icon: Users,
    title: 'Use of the Platform',
    content:
      "OpenAgents is provided as an open-source tool for building, running, and managing AI agent workflows. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the service.",
  },
  {
    icon: ShieldAlert,
    title: 'No Warranty',
    content:
      'OpenAgents is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, error-free, or completely secure.',
  },
  {
    icon: Ban,
    title: 'Limitation of Liability',
    content:
      'To the fullest extent permitted by law, the maintainers and contributors of OpenAgents shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the platform.',
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content:
      "OpenAgents is open-source software. Source code is made available under the project's license on GitHub. Third-party integrations, AI providers, and agent definitions may be subject to their own separate licensing terms.",
  },
  {
    icon: RefreshCw,
    title: 'Changes to These Terms',
    content:
      'These Terms of Service may be updated periodically to reflect new features, improvements, or legal requirements. The "Last Updated" date at the top of this page indicates the most recent revision. Continued use of the platform after changes constitutes acceptance of the revised terms.',
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content:
      'If you have questions about these Terms of Service, please contact the project maintainers by opening an issue or discussion on the official GitHub repository.',
  },
]

import LegalDoc from '../components/layout/LegalDoc'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function TermsOfService() {
  useDocumentTitle('Terms of Service')

  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of Service"
      updated="June 2026"
      intro="These terms outline the rules and guidelines for using OpenAgents, including your responsibilities as a user, the limitations of the platform, and how intellectual property is handled."
      sections={sections}
      footerTitle="Questions about these terms?"
      footerBody="OpenAgents is an open-source project built and maintained by its community. If anything here is unclear, or you'd like to suggest a change, reach out through the official GitHub repository."
    />
  )
}
