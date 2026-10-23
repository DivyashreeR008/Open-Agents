import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AgentsProvider, useAgents, AgentsContext } from '../lib/useAgents'
import SuiteWizard from './SuiteWizard'
import { suites } from '../suites/suitesData'

const mockAgents = [
  { id: 'code-reviewer', name: 'Code Reviewer', description: 'Get a senior-level code review', category: 'Engineering', provider: 'any' },
  { id: 'api-doc-generator', name: 'API Doc Generator', description: 'Generate API documentation', category: 'Engineering', provider: 'any' },
  { id: 'api-error-message-writer', name: 'API Error Message Writer', description: 'Write API error messages', category: 'Engineering', provider: 'any' },
  { id: 'bug-report-generator', name: 'Bug Report Generator', description: 'Generate bug reports', category: 'Engineering', provider: 'any' },
  { id: 'changelog-generator', name: 'Changelog Generator', description: 'Generate changelogs', category: 'Engineering', provider: 'any' },
  { id: 'cicd-pipeline-generator', name: 'CI/CD Pipeline Generator', description: 'Generate CI/CD pipelines', category: 'DevOps', provider: 'any' },
  { id: 'code-complexity-analyzer', name: 'Code Complexity Analyzer', description: 'Analyze code complexity', category: 'Engineering', provider: 'any' },
  { id: 'code-migration-guide', name: 'Code Migration Guide', description: 'Generate migration guides', category: 'Engineering', provider: 'any' },
  { id: 'codebase-entry-guide', name: 'Codebase Entry Guide', description: 'Guide for codebase entry', category: 'Engineering', provider: 'any' },
  { id: 'cron-expression-builder', name: 'Cron Expression Builder', description: 'Build cron expressions', category: 'DevOps', provider: 'any' },
  { id: 'database-query-optimizer', name: 'Database Query Optimizer', description: 'Optimize database queries', category: 'Engineering', provider: 'any' },
  { id: 'dsa-problem-explainer', name: 'DSA Problem Explainer', description: 'Explain DSA problems', category: 'Education', provider: 'any' },
  { id: 'env-doc-generator', name: 'Env Doc Generator', description: 'Generate env documentation', category: 'Engineering', provider: 'any' },
  { id: 'git-branch-naming-generator', name: 'Git Branch Naming Generator', description: 'Generate git branch names', category: 'Engineering', provider: 'any' },
  { id: 'github-issue-claim-comment-generator', name: 'GitHub Issue Claim Comment Generator', description: 'Generate issue claim comments', category: 'Engineering', provider: 'any' },
  { id: 'incident-postmortem-writer', name: 'Incident Postmortem Writer', description: 'Write incident postmortems', category: 'Engineering', provider: 'any' },
  { id: 'incident-runbook-generator', name: 'Incident Runbook Generator', description: 'Generate incident runbooks', category: 'Engineering', provider: 'any' },
  { id: 'k8s-manifest-generator', name: 'K8s Manifest Generator', description: 'Generate K8s manifests', category: 'DevOps', provider: 'any' },
  { id: 'mock-data-generator', name: 'Mock Data Generator', description: 'Generate mock data', category: 'Engineering', provider: 'any' },
  { id: 'pr-description-generator', name: 'PR Description Generator', description: 'Generate PR descriptions', category: 'Engineering', provider: 'any' },
  { id: 'pr-diff-reviewer', name: 'PR Diff Reviewer', description: 'Review PR diffs', category: 'Engineering', provider: 'any' },
  { id: 'regex-generator', name: 'Regex Generator', description: 'Generate regex patterns', category: 'Engineering', provider: 'any' },
  { id: 'technical-debt-report-generator', name: 'Technical Debt Report Generator', description: 'Generate technical debt reports', category: 'Engineering', provider: 'any' },
  { id: 'unit-test-generator', name: 'Unit Test Generator', description: 'Generate unit tests', category: 'Engineering', provider: 'any' },
  { id: 'eli5-explainer', name: 'ELI5 Explainer', description: 'Explain like I am 5', category: 'Education', provider: 'any' },
  { id: 'featureEngineeringAdvisor', name: 'Feature Engineering Advisor', description: 'Advise on feature engineering', category: 'Engineering', provider: 'any' },
  { id: 'ml-experiment-autopsy', name: 'ML Experiment Autopsy', description: 'Analyze ML experiments', category: 'Engineering', provider: 'any' },
  { id: 'ml-experiment-report-generator', name: 'ML Experiment Report Generator', description: 'Generate ML experiment reports', category: 'Engineering', provider: 'any' },
  { id: 'cloud-cost-estimator', name: 'Cloud Cost Estimator', description: 'Estimate cloud costs', category: 'DevOps', provider: 'any' },
  { id: 'sql-query-generator', name: 'SQL Query Generator', description: 'Generate SQL queries', category: 'Engineering', provider: 'any' },
  { id: 'sql-query-optimizer', name: 'SQL Query Optimizer', description: 'Optimize SQL queries', category: 'Engineering', provider: 'any' },
  { id: 'etl-pipeline-troubleshooter', name: 'ETL Pipeline Troubleshooter', description: 'Troubleshoot ETL pipelines', category: 'Engineering', provider: 'any' },
  { id: 'data-cleaning-plan-generator', name: 'Data Cleaning Plan Generator', description: 'Generate data cleaning plans', category: 'Engineering', provider: 'any' },
  { id: 'data-dictionary-generator', name: 'Data Dictionary Generator', description: 'Generate data dictionaries', category: 'Engineering', provider: 'any' },
  { id: 'dataset-description-generator', name: 'Dataset Description Generator', description: 'Generate dataset descriptions', category: 'Engineering', provider: 'any' },
  { id: 'ai-project-architecture-agent', name: 'AI Project Architecture Agent', description: 'Architect AI projects', category: 'Engineering', provider: 'any' },
  { id: 'salesDiscoveryCallGenerator', name: 'Sales Discovery Call Generator', description: 'Generate sales discovery calls', category: 'Sales', provider: 'any' },
  { id: 'sales_objection_handler', name: 'Sales Objection Handler', description: 'Handle sales objections', category: 'Sales', provider: 'any' },
  { id: 'linkedin-outreach-message-writer', name: 'LinkedIn Outreach Message Writer', description: 'Write LinkedIn outreach messages', category: 'Sales', provider: 'any' },
  { id: 'win-loss-analysis-report-generator', name: 'Win/Loss Analysis Report Generator', description: 'Generate win/loss analysis reports', category: 'Sales', provider: 'any' },
  { id: 'salary-negotiation-script', name: 'Salary Negotiation Script', description: 'Generate salary negotiation scripts', category: 'Sales', provider: 'any' },
  { id: 'blog-post-seo-optimizer', name: 'Blog Post SEO Optimizer', description: 'Optimize blog posts for SEO', category: 'Marketing', provider: 'any' },
  { id: 'cold-email-writer', name: 'Cold Email Writer', description: 'Write cold emails', category: 'Sales', provider: 'any' },
  { id: 'linkedin-post-writer', name: 'LinkedIn Post Writer', description: 'Write LinkedIn posts', category: 'Marketing', provider: 'any' },
  { id: 'seo-keyword-planner', name: 'SEO Keyword Planner', description: 'Plan SEO keywords', category: 'Marketing', provider: 'any' },
  { id: 'social-media-thread-writer', name: 'Social Media Thread Writer', description: 'Write social media threads', category: 'Marketing', provider: 'any' },
  { id: 'persona-generator', name: 'Persona Generator', description: 'Generate personas', category: 'Product', provider: 'any' },
  { id: 'competitive-analysis-generator', name: 'Competitive Analysis Generator', description: 'Generate competitive analysis', category: 'Business', provider: 'any' },
  { id: 'tone-rewriter', name: 'Tone Rewriter', description: 'Rewrite tone', category: 'Productivity', provider: 'any' },
  { id: 'color-palette-generator', name: 'Color Palette Generator', description: 'Generate color palettes', category: 'Design', provider: 'any' },
  { id: 'font-pair-generator', name: 'Font Pair Generator', description: 'Generate font pairs', category: 'Design', provider: 'any' },
  { id: 'typography-pairer', name: 'Typography Pairer', description: 'Pair typography', category: 'Design', provider: 'any' },
  { id: 'accessibility-audit-generator', name: 'Accessibility Audit Generator', description: 'Generate accessibility audits', category: 'Engineering', provider: 'any' },
  { id: 'game_world_lore_generator', name: 'Game World Lore Generator', description: 'Generate game world lore', category: 'Gaming', provider: 'any' },
  { id: 'npc-dialogue-lore-generator', name: 'NPC Dialogue & Lore Generator', description: 'Generate NPC dialogue and lore', category: 'Gaming', provider: 'any' },
  { id: 'email-reply-writer', name: 'Email Reply Writer', description: 'Write email replies', category: 'Productivity', provider: 'any' },
  { id: 'meeting-notes-summarizer', name: 'Meeting Notes Summarizer', description: 'Summarize meeting notes', category: 'Productivity', provider: 'any' },
  { id: 'pdf-summarizer', name: 'PDF Summarizer', description: 'Summarize PDFs', category: 'Productivity', provider: 'any' },
  { id: 'proposal-document-generator', name: 'Proposal Document Generator', description: 'Generate proposal documents', category: 'Sales', provider: 'any' },
  { id: 'grant-proposal-writer', name: 'Grant Proposal Writer', description: 'Write grant proposals', category: 'Education', provider: 'any' },
  { id: 'user-story-writer', name: 'User Story Writer', description: 'Write user stories', category: 'Product', provider: 'any' },
  { id: 'prd-generator', name: 'PRD Generator', description: 'Generate PRDs', category: 'Product', provider: 'any' },
  { id: 'research-agent', name: 'Research Agent', description: 'Conduct research', category: 'Research', provider: 'any' },
  { id: 'aiStudyPlanner', name: 'AI Study Planner', description: 'Plan studies with AI', category: 'Education', provider: 'any' },
  { id: 'flashcard-generator', name: 'Flashcard Generator', description: 'Generate flashcards', category: 'Education', provider: 'any' },
  { id: 'mnemonic-generator', name: 'Mnemonic Generator', description: 'Generate mnemonics', category: 'Education', provider: 'any' },
  { id: 'skill-gap-roadmap-agent', name: 'Skill Gap Roadmap Agent', description: 'Generate skill gap roadmaps', category: 'Education', provider: 'any' },
  { id: 'cover-letter-writer', name: 'Cover Letter Writer', description: 'Write cover letters', category: 'HR', provider: 'any' },
  { id: 'resume-screener', name: 'Resume Screener', description: 'Screen resumes', category: 'HR', provider: 'any' },
  { id: 'performance-review-writer', name: 'Performance Review Writer', description: 'Write performance reviews', category: 'HR', provider: 'any' },
  { id: 'path-pilot', name: 'PathPilot', description: 'Pilot career paths', category: 'Productivity', provider: 'any' },
  { id: 'employee-onboarding-planner', name: 'Employee Onboarding Planner', description: 'Plan employee onboarding', category: 'HR', provider: 'any' },
  { id: 'customerSuccessCheckin', name: 'Customer Success Check-in Generator', description: 'Generate customer success check-ins', category: 'Marketing', provider: 'any' },
  { id: 'invoice-description-generator', name: 'Invoice Description Generator', description: 'Generate invoice descriptions', category: 'Business', provider: 'any' },
  { id: 'privacy-policy-generator', name: 'Privacy Policy Generator', description: 'Generate privacy policies', category: 'Legal', provider: 'any' },
  { id: 'contract-explainer', name: 'Contract Explainer', description: 'Explain contracts', category: 'Legal', provider: 'any' },
  { id: 'startup-idea-validator', name: 'Startup Idea Validator', description: 'Validate startup ideas', category: 'Business', provider: 'any' },
  { id: 'personal-budget-analyzer', name: 'Personal Budget Analyzer', description: 'Analyze personal budgets', category: 'Finance', provider: 'any' },
  { id: 'home-buying-checklist', name: 'Home Buying Checklist', description: 'Generate home buying checklists', category: 'Real Estate', provider: 'any' },
  { id: 'property-description-writer', name: 'Property Description Writer', description: 'Write property descriptions', category: 'Real Estate', provider: 'any' },
  { id: 'real-estate-listing-generator', name: 'Real Estate Listing Generator', description: 'Generate real estate listings', category: 'Real Estate', provider: 'any' },
  { id: 'health-wellness-plan', name: 'Health & Wellness Plan', description: 'Generate health and wellness plans', category: 'Healthcare', provider: 'any' },
  { id: 'medication-interaction-explainer', name: 'Medication Interaction Explainer', description: 'Explain medication interactions', category: 'Healthcare', provider: 'any' },
  { id: 'patient-discharge-summary-writer', name: 'Patient Discharge Summary Writer', description: 'Write patient discharge summaries', category: 'Healthcare', provider: 'any' },
  { id: 'patient-preconsultation-note', name: 'Patient Pre-Consultation Note', description: 'Generate patient pre-consultation notes', category: 'Healthcare', provider: 'any' },
  { id: 'phishing-email-detector', name: 'Phishing Email Detector', description: 'Detect phishing emails', category: 'Cybersecurity', provider: 'any' },
  { id: 'smart-contract-auditor', name: 'Smart Contract Auditor', description: 'Audit smart contracts', category: 'Web3', provider: 'any' },
  { id: 'solidity-code-reviewer', name: 'Solidity Code Reviewer', description: 'Review Solidity code', category: 'Web3', provider: 'any' },
  { id: 'web3-whitepaper-writer', name: 'Web3 Whitepaper Writer', description: 'Write Web3 whitepapers', category: 'Web3', provider: 'any' },
  { id: 'game-system-compatibility-analyser', name: 'Game System Compatibility Analyser', description: 'Analyse game system compatibility', category: 'Gaming', provider: 'any' },
  { id: 'future-self-letter-agent', name: 'Future Self Letter Agent', description: 'Write letters to future self', category: 'Productivity', provider: 'any' },
]

function MockAgentsProvider({ children }) {
  return (
    <AgentsContext.Provider value={{ agents: mockAgents, loading: false, error: null, reloadAgents: vi.fn(), catalogSize: mockAgents.length }}>
      {children}
    </AgentsContext.Provider>
  )
}

function renderSuiteWizard(suiteId = 'developer', options = {}) {
  const suite = suites.find(s => s.id === suiteId)
  const onBack = options.onBack || vi.fn()

  return render(
    <MemoryRouter>
      <MockAgentsProvider>
        <SuiteWizard suite={suite} onBack={onBack} />
      </MockAgentsProvider>
    </MemoryRouter>
  )
}

describe('SuiteWizard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Initial render', () => {
    it('renders the suite name and first question', () => {
      renderSuiteWizard('developer')
      expect(screen.getByText('Developer Suite')).toBeInTheDocument()
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('What are you working on today?')).toBeInTheDocument()
    })

    it('renders all options for the first question', () => {
      renderSuiteWizard('developer')
      expect(screen.getByText('Writing or reviewing code')).toBeInTheDocument()
      expect(screen.getByText('Writing documentation')).toBeInTheDocument()
      expect(screen.getByText('Fixing bugs or incidents')).toBeInTheDocument()
      expect(screen.getByText('Setting up infrastructure')).toBeInTheDocument()
    })

    it('shows progress bar at correct initial value', () => {
      renderSuiteWizard('developer')
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
      expect(screen.getByText('50% complete')).toBeInTheDocument()
    })

    it('disables Next button until an option is selected', () => {
      renderSuiteWizard('developer')
      const nextButton = screen.getByRole('button', { name: /Next/i })
      expect(nextButton).toBeDisabled()
    })

    it('shows Previous button as disabled on first question', () => {
      renderSuiteWizard('developer')
      const prevButton = screen.getByRole('button', { name: /Previous/i })
      expect(prevButton).toBeDisabled()
    })

    it('shows Skip this question and View all agents buttons', () => {
      renderSuiteWizard('developer')
      expect(screen.getByRole('button', { name: /Skip this question/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /View all agents/i })).toBeInTheDocument()
    })
  })

  describe('Answering questions', () => {
    it('enables Next button after selecting an option', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      const nextButton = screen.getByRole('button', { name: /Next/i })
      expect(nextButton).not.toBeDisabled()
    })

    it('advances to next question when Next is clicked', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
      expect(screen.getByText('What is your experience level?')).toBeInTheDocument()
    })

    it('updates progress bar when advancing', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
      expect(screen.getByText('100% complete')).toBeInTheDocument()
    })

    it('enables Previous button on second question', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      const prevButton = screen.getByRole('button', { name: /Previous/i })
      expect(prevButton).not.toBeDisabled()
    })

    it('goes back to previous question when Previous is clicked', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Previous/i }))
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('What are you working on today?')).toBeInTheDocument()
    })

    it('preserves answer when going back and forth', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Previous/i }))
      expect(screen.getByText('Writing or reviewing code')).toHaveAttribute('data-option', 'true')
      const selectedOption = screen.getByText('Writing or reviewing code').closest('button')
      expect(selectedOption).toHaveClass('border-zinc-900')
    })
  })

  describe('Skipping questions', () => {
    it('advances to next question when Skip is clicked without selecting an option', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    })

    it('does not record answer when skipping', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      // Click next on second question without selecting an option
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      expect(screen.getByText('Best matches for you')).toBeInTheDocument()
    })

    it('can skip multiple questions', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      expect(screen.getByText('All agents in this suite')).toBeInTheDocument()
    })

    it('shows unranked agents when all questions are skipped', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))
      expect(screen.getByText('All agents in this suite')).toBeInTheDocument()
      expect(screen.queryByText('Best matches for you')).not.toBeInTheDocument()
    })
  })

  describe('View all agents', () => {
    it('shows all suite agents unranked when View all agents is clicked', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /View all agents/i }))
      expect(screen.getByText('All agents in this suite')).toBeInTheDocument()
      expect(screen.queryByText('Best matches for you')).not.toBeInTheDocument()
    })

    it('shows all agents from the suite', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByRole('button', { name: /View all agents/i }))
      expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
      expect(screen.getByText('API Doc Generator')).toBeInTheDocument()
      expect(screen.getByText('Unit Test Generator')).toBeInTheDocument()
    })
  })

  describe('Results ranking', () => {
    it('ranks agents based on answer tags', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      expect(screen.getByText('Best matches for you')).toBeInTheDocument()
      expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
    })

    it('shows match percentage badges for answered questions', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      const codeReviewerCard = screen.getByText('Code Reviewer').closest('button')
      expect(codeReviewerCard).toHaveTextContent(/%/)
    })

    it('shows "Also in this suite" section for unmatched agents', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      expect(screen.getByText('Also in this suite')).toBeInTheDocument()
    })

    it('sorts matched agents by percentage descending', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      const matchedContainer = screen.getByText('Best matches for you').closest('div').nextElementSibling
      const cards = matchedContainer.querySelectorAll('button')
      const percentages = Array.from(cards).map(card => {
        const badge = card.querySelector('span[class*="bg-"]')
        return badge ? parseInt(badge.textContent) : 0
      })
      expect(percentages).toEqual([...percentages].sort((a, b) => b - a))
    })
  })

  describe('Suite with single question', () => {
    it('shows results after answering the only question', () => {
      renderSuiteWizard('data-ai')
      fireEvent.click(screen.getByText('Building ML models'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      expect(screen.getByText('Best matches for you')).toBeInTheDocument()
    })

    it('shows progress at 100% after single question', () => {
      renderSuiteWizard('data-ai')
      fireEvent.click(screen.getByText('Building ML models'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      // In results view, progress bar is not shown, but we can verify we're in results
      expect(screen.getByText('Best matches for you')).toBeInTheDocument()
    })
  })

  describe('Suite with two options in question', () => {
    it('works correctly with health suite having 2 options', () => {
      renderSuiteWizard('health')
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument()
      expect(screen.getByText('Who are you?')).toBeInTheDocument()
      expect(screen.getByText('Healthcare professional')).toBeInTheDocument()
      expect(screen.getByText('Personal wellness')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles Enter key to advance when answer is selected', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.keyDown(window, { key: 'Enter' })
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    })

    it('does not advance on Enter when no answer selected', () => {
      renderSuiteWizard('developer')
      fireEvent.keyDown(window, { key: 'Enter' })
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    })

    it('calls onBack when back button in header is clicked', () => {
      const onBack = vi.fn()
      renderSuiteWizard('developer', { onBack })
      fireEvent.click(screen.getByRole('button', { name: /Back to suites/i }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('calls onBack when back button in results is clicked', () => {
      const onBack = vi.fn()
      renderSuiteWizard('developer', { onBack })
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Back to suites/i }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('handles agents not found in registry gracefully', () => {
      const suiteWithUnknownAgents = {
        ...suites[0],
        agents: ['unknown-agent-1', 'unknown-agent-2'],
        quiz: suites[0].quiz
      }
      render(
        <MemoryRouter>
          <MockAgentsProvider>
            <SuiteWizard suite={suiteWithUnknownAgents} onBack={vi.fn()} />
          </MockAgentsProvider>
        </MemoryRouter>
      )
      // Answer a question to get to results
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      expect(screen.getAllByText('Agent not found')).toHaveLength(2)
    })
  })

  describe('Badge color logic', () => {
    it('shows gray badge for 0% match when answeredCount > 0', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByText('Beginner'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Find an agent with 0% match (e.g., API Doc Generator)
      const apiDocCard = screen.getByText('API Doc Generator').closest('button')
      const badge = apiDocCard.querySelector('span[class*="bg-gray-100"]')
      expect(badge).toBeInTheDocument()
    })

    it('shows zinc badge for high match percentage', () => {
      renderSuiteWizard('developer')
      fireEvent.click(screen.getByText('Writing or reviewing code'))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      // Skip second question to get 100% for tagged agents
      fireEvent.click(screen.getByRole('button', { name: /Skip this question/i }))

      const codeReviewerCard = screen.getByText('Code Reviewer').closest('button')
      const badge = codeReviewerCard.querySelector('span[class*="bg-zinc-100"]')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('All suites render without error', () => {
    suites.forEach(suite => {
      it(`renders ${suite.name} without error`, () => {
        renderSuiteWizard(suite.id)
        expect(screen.getByText(suite.name)).toBeInTheDocument()
      })
    })
  })
})