import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import App, { PageLoader, MainLayout } from './App'
import { MAIN_CONTENT_ID } from './components/SkipToMainContentLink'

// Spies to track when dynamic imports are loaded by React.lazy
const pageImportSpies = vi.hoisted(() => ({
  HomePage: vi.fn(),
  AgentPage: vi.fn(),
  BattleModeLanding: vi.fn(),
  BattleModeSetup: vi.fn(),
  BattleModeArena: vi.fn(),
  BattleModeWinner: vi.fn(),
  WorkflowLibrary: vi.fn(),
  WorkflowBuilder: vi.fn(),
  WorkflowDetail: vi.fn(),
  WorkflowRunner: vi.fn(),
  NotFoundPage: vi.fn(),
  SuitesPage: vi.fn(),
  CollectionsPage: vi.fn(),
  CollectionDetailPage: vi.fn(),
  AutomationsPage: vi.fn(),
  AutomationDetailPage: vi.fn(),
  MarketplacePage: vi.fn(),
  MarketplaceDraftsPage: vi.fn(),
  MarketplaceDraftPage: vi.fn(),
  Privacy: vi.fn(),
  TermsOfService: vi.fn(),
  SettingsPage: vi.fn(),
  AnalyticsPage: vi.fn(),
  AboutPage: vi.fn(),
  PortfolioPage: vi.fn(),
  FeedbackPage: vi.fn(),
}))

const errorBoundaryControl = vi.hoisted(() => ({
  shouldThrow: false,
}))

const suspenseControl = vi.hoisted(() => ({
  shouldSuspend: false,
  pendingPromise: null,
}))

// Mock all lazy-loaded page modules
vi.mock('./pages/HomePage', () => {
  pageImportSpies.HomePage()
  return { default: () => <div data-testid="page-home">Home Page</div> }
})

vi.mock('./pages/AgentPage', () => {
  pageImportSpies.AgentPage()
  return { default: () => <div data-testid="page-agent">Agent Page</div> }
})

vi.mock('./pages/BattleModeLanding', () => {
  pageImportSpies.BattleModeLanding()
  return { default: () => <div data-testid="page-battle-landing">Battle Landing Page</div> }
})

vi.mock('./pages/BattleModeSetup', () => {
  pageImportSpies.BattleModeSetup()
  return { default: () => <div data-testid="page-battle-setup">Battle Setup Page</div> }
})

vi.mock('./pages/BattleModeArena', () => {
  pageImportSpies.BattleModeArena()
  return { default: () => <div data-testid="page-battle-arena">Battle Arena Page</div> }
})

vi.mock('./pages/BattleModeWinner', () => {
  pageImportSpies.BattleModeWinner()
  return { default: () => <div data-testid="page-battle-winner">Battle Winner Page</div> }
})

vi.mock('./pages/WorkflowLibrary', () => {
  pageImportSpies.WorkflowLibrary()
  return { default: () => <div data-testid="page-workflows">Workflow Library Page</div> }
})

vi.mock('./pages/WorkflowBuilder', () => {
  pageImportSpies.WorkflowBuilder()
  return { default: () => <div data-testid="page-workflow-builder">Workflow Builder Page</div> }
})

vi.mock('./pages/WorkflowDetail', () => {
  pageImportSpies.WorkflowDetail()
  return { default: () => <div data-testid="page-workflow-detail">Workflow Detail Page</div> }
})

vi.mock('./pages/WorkflowRunner', () => {
  pageImportSpies.WorkflowRunner()
  return { default: () => <div data-testid="page-workflow-runner">Workflow Runner Page</div> }
})

vi.mock('./pages/NotFoundPage', () => {
  pageImportSpies.NotFoundPage()
  return { default: () => <div data-testid="page-not-found">Not Found Page</div> }
})

vi.mock('./pages/SuitesPage', () => {
  pageImportSpies.SuitesPage()
  return { default: () => <div data-testid="page-suites">Suites Page</div> }
})

vi.mock('./pages/CollectionsPage', () => {
  pageImportSpies.CollectionsPage()
  return { default: () => <div data-testid="page-collections">Collections Page</div> }
})

vi.mock('./pages/CollectionDetailPage', () => {
  pageImportSpies.CollectionDetailPage()
  return { default: () => <div data-testid="page-collection-detail">Collection Detail Page</div> }
})

vi.mock('./pages/AutomationsPage', () => {
  pageImportSpies.AutomationsPage()
  return { default: () => <div data-testid="page-automations">Automations Page</div> }
})

vi.mock('./pages/AutomationDetailPage', () => {
  pageImportSpies.AutomationDetailPage()
  return { default: () => <div data-testid="page-automation-detail">Automation Detail Page</div> }
})

vi.mock('./pages/MarketplacePage', () => {
  pageImportSpies.MarketplacePage()
  return { default: () => <div data-testid="page-marketplace">Marketplace Page</div> }
})

vi.mock('./pages/MarketplaceDraftsPage', () => {
  pageImportSpies.MarketplaceDraftsPage()
  return { default: () => <div data-testid="page-marketplace-drafts">Marketplace Drafts Page</div> }
})

vi.mock('./pages/MarketplaceDraftPage', () => {
  pageImportSpies.MarketplaceDraftPage()
  return { default: () => <div data-testid="page-marketplace-draft">Marketplace Draft Page</div> }
})

vi.mock('./pages/Privacy', () => {
  pageImportSpies.Privacy()
  return { default: () => <div data-testid="page-privacy">Privacy Page</div> }
})

vi.mock('./pages/TermsOfService', () => {
  pageImportSpies.TermsOfService()
  return { default: () => <div data-testid="page-terms">Terms of Service Page</div> }
})

vi.mock('./pages/SettingsPage', () => {
  pageImportSpies.SettingsPage()
  return {
    default: () => {
      if (errorBoundaryControl.shouldThrow) {
        throw new Error('Crash inside settings page')
      }
      return <div data-testid="page-settings">Settings Page</div>
    },
  }
})

vi.mock('./pages/AnalyticsPage', () => {
  pageImportSpies.AnalyticsPage()
  return { default: () => <div data-testid="page-analytics">Analytics Page</div> }
})

vi.mock('./pages/AboutPage', () => {
  pageImportSpies.AboutPage()
  return {
    default: () => {
      if (suspenseControl.shouldSuspend) {
        throw suspenseControl.pendingPromise
      }
      return <div data-testid="page-about">About Page</div>
    },
  }
})

vi.mock('./pages/PortfolioPage', () => {
  pageImportSpies.PortfolioPage()
  return { default: () => <div data-testid="page-portfolio">Portfolio Page</div> }
})

vi.mock('./pages/FeedbackPage', () => {
  pageImportSpies.FeedbackPage()
  return { default: () => <div data-testid="page-feedback">Feedback Page</div> }
})

// Mock layout dependencies
vi.mock('./lib/useAgents', () => ({
  AgentsProvider: ({ children }) => children,
  useAgents: () => ({
    agents: [
      { id: 'agent-1', name: 'Alpha Agent', description: 'Alpha', category: 'General' },
      { id: 'agent-2', name: 'Beta Agent', description: 'Beta', category: 'General' },
    ],
    loading: false,
    error: null,
    catalogSize: 2,
    reloadAgents: vi.fn(),
  }),
}))

vi.mock('./lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all-agents',
  useCollections: () => ({
    collections: [
      { id: 'all-agents', name: 'All Agents', agentIds: ['agent-1', 'agent-2'], isDefault: true },
      { id: 'custom-1', name: 'Favorites', agentIds: ['agent-1'], isDefault: false },
    ],
    moveAgentToCollection: vi.fn(() => ({ ok: true })),
  }),
}))

vi.mock('./hooks/useWorkflows', () => ({
  fetchWorkflows: vi.fn().mockResolvedValue({ data: [], error: null }),
  fetchWorkflowById: vi.fn().mockResolvedValue({ data: null, error: null }),
  incrementUsage: vi.fn().mockResolvedValue({ ok: true }),
}))

vi.mock('./lib/useSessionSpend', () => ({
  useSessionSpend: () => ({
    totalSpend: 0,
    runs: [],
    clearSession: vi.fn(),
  }),
}))

function renderAppAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

describe('App Shell and Route Audit (Issue #594)', () => {
  beforeEach(() => {
    errorBoundaryControl.shouldThrow = false
    suspenseControl.shouldSuspend = false
    suspenseControl.pendingPromise = null
  })

  describe('Route Table Resolution', () => {
    const ROUTE_DEFINITIONS = [
      { path: '/', expectedTestId: 'page-portfolio', label: 'PortfolioPage (root)' },
      { path: '/agents', expectedTestId: 'page-home', label: 'HomePage' },
      { path: '/about', expectedTestId: 'page-about', label: 'AboutPage' },
      { path: '/feedback', expectedTestId: 'page-feedback', label: 'FeedbackPage' },
      { path: '/privacy', expectedTestId: 'page-privacy', label: 'Privacy' },
      { path: '/terms', expectedTestId: 'page-terms', label: 'TermsOfService' },
      { path: '/settings', expectedTestId: 'page-settings', label: 'SettingsPage' },
      { path: '/agent/summarizer-agent', expectedTestId: 'page-agent', label: 'AgentPage' },
      { path: '/suites', expectedTestId: 'page-suites', label: 'SuitesPage' },
      { path: '/collections', expectedTestId: 'page-collections', label: 'CollectionsPage' },
      {
        path: '/collections/custom-col',
        expectedTestId: 'page-collection-detail',
        label: 'CollectionDetailPage',
      },
      {
        path: '/scheduler',
        expectedTestId: 'page-automations',
        label: 'AutomationsPage (/scheduler alias)',
      },
      {
        path: '/automations',
        expectedTestId: 'page-automations',
        label: 'AutomationsPage (/automations canonical)',
      },
      {
        path: '/automations/job-99',
        expectedTestId: 'page-automation-detail',
        label: 'AutomationDetailPage',
      },
      { path: '/marketplace', expectedTestId: 'page-marketplace', label: 'MarketplacePage' },
      {
        path: '/marketplace/drafts',
        expectedTestId: 'page-marketplace-drafts',
        label: 'MarketplaceDraftsPage',
      },
      {
        path: '/marketplace/drafts/draft-456',
        expectedTestId: 'page-marketplace-draft',
        label: 'MarketplaceDraftPage',
      },
      { path: '/analytics', expectedTestId: 'page-analytics', label: 'AnalyticsPage' },
      { path: '/workflows', expectedTestId: 'page-workflows', label: 'WorkflowLibrary' },
      {
        path: '/workflows/build',
        expectedTestId: 'page-workflow-builder',
        label: 'WorkflowBuilder',
      },
      {
        path: '/workflows/flow-123',
        expectedTestId: 'page-workflow-detail',
        label: 'WorkflowDetail',
      },
      {
        path: '/workflows/flow-123/run',
        expectedTestId: 'page-workflow-runner',
        label: 'WorkflowRunner',
      },
      { path: '/battle', expectedTestId: 'page-battle-landing', label: 'BattleModeLanding' },
      { path: '/battle/setup', expectedTestId: 'page-battle-setup', label: 'BattleModeSetup' },
      { path: '/battle/arena', expectedTestId: 'page-battle-arena', label: 'BattleModeArena' },
      { path: '/battle/winner', expectedTestId: 'page-battle-winner', label: 'BattleModeWinner' },
    ]

    ROUTE_DEFINITIONS.forEach(({ path, expectedTestId, label }) => {
      it(`resolves ${path} to ${label}`, async () => {
        renderAppAt(path)
        const element = await screen.findByTestId(expectedTestId)
        expect(element).toBeInTheDocument()
      })
    })

    it('routes both /scheduler and /automations to the shared AutomationsPage destination', async () => {
      const { unmount: unmountScheduler } = renderAppAt('/scheduler')
      expect(await screen.findByTestId('page-automations')).toBeInTheDocument()
      unmountScheduler()

      renderAppAt('/automations')
      expect(await screen.findByTestId('page-automations')).toBeInTheDocument()
    })

    it('routes unmatched catch-all paths to NotFoundPage', async () => {
      const { unmount } = renderAppAt('/this-is-not-a-valid-route')
      expect(await screen.findByTestId('page-not-found')).toBeInTheDocument()
      unmount()

      renderAppAt('/nested/unrecognized/deep/route')
      expect(await screen.findByTestId('page-not-found')).toBeInTheDocument()
    })
  })

  describe('Shared Layout & Accessibility Landmarks', () => {
    it('renders the skip link targeting the documented main landmark id', () => {
      renderAppAt('/')

      const skipLink = screen.getByRole('link', { name: /skip to main content/i })
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`)
    })

    it('renders the main landmark with the documented id and tab index for focus management', () => {
      renderAppAt('/')

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('id', MAIN_CONTENT_ID)
      expect(main).toHaveAttribute('id', 'main-content')
      expect(main).toHaveAttribute('tabindex', '-1')
    })

    it('renders the header navbar banner, sidebar rail, and floating feedback link', () => {
      renderAppAt('/')

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(document.querySelector('aside')).toBeInTheDocument()

      const feedbackLink = screen.getByRole('link', { name: /give feedback/i })
      expect(feedbackLink).toBeInTheDocument()
      expect(feedbackLink).toHaveAttribute('href', '/feedback')
    })
  })

  describe('Sidebar Drawer State & Interaction Lifecycle', () => {
    it('starts closed, opens via navbar button, and closes via overlay or link click', async () => {
      const user = userEvent.setup()
      renderAppAt('/')

      const aside = document.querySelector('aside')
      expect(aside).toHaveClass('-translate-x-full')
      expect(aside).not.toHaveClass('translate-x-0')

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

      // Open sidebar
      await user.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
      expect(aside).toHaveClass('translate-x-0')

      // Overlay should be present
      const overlay = document.querySelector('.fixed.inset-0.z-30.bg-black\\/50')
      expect(overlay).toBeInTheDocument()

      // Click overlay to close
      await user.click(overlay)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(aside).toHaveClass('-translate-x-full')
      expect(document.querySelector('.fixed.inset-0.z-30.bg-black\\/50')).toBeNull()

      // Open again and close via nav callback
      await user.click(toggleButton)
      expect(aside).toHaveClass('translate-x-0')

      const navWorkflows = document.getElementById('nav-workflows-link')
      expect(navWorkflows).toBeInTheDocument()
      await user.click(navWorkflows)

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(aside).toHaveClass('-translate-x-full')
    })
  })

  describe('Suspense Fallback & Accessible Status Region', () => {
    it('PageLoader component satisfies accessibility requirements', () => {
      const { container } = render(<PageLoader />)

      const statusRegion = screen.getByRole('status')
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const spinner = container.querySelector('svg')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('displays the PageLoader fallback while a lazy route component is resolving', async () => {
      let resolveAbout
      suspenseControl.pendingPromise = new Promise((resolve) => {
        resolveAbout = resolve
      })
      suspenseControl.shouldSuspend = true

      renderAppAt('/about')

      // Fallback is displayed with polite status region
      const statusRegions = screen.getAllByRole('status')
      const loaderStatus = statusRegions.find((el) => el.textContent.includes('Loading...'))
      expect(loaderStatus).toBeDefined()
      expect(loaderStatus).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Loading...')).toBeInTheDocument()

      // Resolve the suspended route
      await act(async () => {
        suspenseControl.shouldSuspend = false
        resolveAbout()
      })

      expect(await screen.findByTestId('page-about')).toBeInTheDocument()
    })
  })

  describe('ErrorBoundary Route Failure & Recovery', () => {
    it('catches route render failure and allows recovery via Try Again button', async () => {
      const user = userEvent.setup()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      errorBoundaryControl.shouldThrow = true
      renderAppAt('/settings')

      // Fallback UI caught by ErrorBoundary
      expect(
        await screen.findByRole('heading', { name: /failed to render output/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/crash inside settings page/i)).toBeInTheDocument()

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      expect(tryAgainButton).toBeInTheDocument()

      // Fix underlying error and trigger recovery
      errorBoundaryControl.shouldThrow = false
      await user.click(tryAgainButton)

      expect(await screen.findByTestId('page-settings')).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', { name: /failed to render output/i })
      ).not.toBeInTheDocument()

      consoleError.mockRestore()
    })
  })

  describe('RouteAnnouncer & PageTransition Location Integration', () => {
    let navigate
    function NavTestBridge() {
      navigate = useNavigate()
      return null
    }

    it('receives location transitions without throwing exceptions', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <NavTestBridge />
          <App />
        </MemoryRouter>
      )

      expect(await screen.findByTestId('page-portfolio')).toBeInTheDocument()

      // Navigate to /agents
      await act(async () => {
        navigate('/agents')
      })
      expect(await screen.findByTestId('page-home')).toBeInTheDocument()

      // Navigate to /workflows
      await act(async () => {
        navigate('/workflows')
      })
      expect(await screen.findByTestId('page-workflows')).toBeInTheDocument()

      // Navigate to /settings
      await act(async () => {
        navigate('/settings')
      })
      expect(await screen.findByTestId('page-settings')).toBeInTheDocument()
    })
  })

  describe('Lazy Route Isolation & Non-Eager Import Verification', () => {
    it('does not eagerly import unused lazy routes when loading a specific route', async () => {
      // Clear spies to verify clean import behavior
      pageImportSpies.BattleModeWinner.mockClear()
      pageImportSpies.MarketplaceDraftPage.mockClear()

      renderAppAt('/privacy')
      expect(await screen.findByTestId('page-privacy')).toBeInTheDocument()

      // Unused lazy routes should not have been loaded
      expect(pageImportSpies.BattleModeWinner).not.toHaveBeenCalled()
      expect(pageImportSpies.MarketplaceDraftPage).not.toHaveBeenCalled()
    })
  })
})
