import { useState, Suspense, lazy } from 'react'
import { Routes, Route, Outlet ,Link} from 'react-router-dom'
import { Loader2 ,MessageSquare} from 'lucide-react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SkipToMainContentLink, { MAIN_CONTENT_ID } from './components/SkipToMainContentLink'
import ScrollToTopButton from './components/ScrollToTopButton'
import ScrollToBottom from './components/ScrollToBottom'
import ErrorBoundary from './components/ErrorBoundary'
import PageTransition from './components/PageTransition'
import RouteAnnouncer from './components/RouteAnnouncer'

const HomePage = lazy(() => import('./pages/HomePage'))
const AgentPage = lazy(() => import('./pages/AgentPage'))
const BattleModeLanding = lazy(() => import('./pages/BattleModeLanding'))
const BattleModeSetup = lazy(() => import('./pages/BattleModeSetup'))
const BattleModeArena = lazy(() => import('./pages/BattleModeArena'))
const BattleModeWinner = lazy(() => import('./pages/BattleModeWinner'))
const WorkflowLibrary = lazy(() => import('./pages/WorkflowLibrary'))
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'))
const WorkflowDetail = lazy(() => import('./pages/WorkflowDetail'))
const WorkflowRunner = lazy(() => import('./pages/WorkflowRunner'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const SuitesPage = lazy(() => import('./pages/SuitesPage'))
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'))
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'))
const AutomationsPage = lazy(() => import('./pages/AutomationsPage'))
const AutomationDetailPage = lazy(() => import('./pages/AutomationDetailPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const MarketplaceDraftsPage = lazy(() => import('./pages/MarketplaceDraftsPage'))
const MarketplaceDraftPage = lazy(() => import('./pages/MarketplaceDraftPage'))
const Privacy = lazy(() => import('./pages/Privacy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))

function PageLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] gap-3"
      role="status"
      aria-live="polite"
    >
      <Loader2 size={32} className="animate-spin text-zinc-900 dark:text-white" aria-hidden="true" />
      <p className="text-sm dark:text-text-secondary text-gray-500">Loading...</p>
    </div>
  )
}

function MainLayout({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <SkipToMainContentLink />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Link
        to="/feedback"
        className="fixed bottom-5 right-5 z-50
        inline-flex items-center gap-2
        border border-black bg-white px-3.5 py-2.5
        text-[13px] font-medium text-black
        transition-colors
        hover:bg-black hover:text-white
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
        dark:border-white dark:bg-white dark:text-black
        dark:hover:bg-black dark:hover:text-white
        dark:focus-visible:outline-white"
        aria-label="Give feedback"
      >
        <MessageSquare size={18} />
        <span>Feedback</span>
      </Link>
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="pt-12 lg:pl-60 focus:outline-none">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen transition-theme bg-white dark:bg-surface">
      <ScrollToTopButton />
      <ScrollToBottom />
      <RouteAnnouncer />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
            <Routes>
            <Route element={
              <MainLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }>
              <Route path="/" element={<PortfolioPage />} />
              <Route path="/agents" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/agent/:id" element={<AgentPage />} />
              <Route path="/suites" element={<SuitesPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:id" element={<CollectionDetailPage />} />
              <Route path="/scheduler" element={<AutomationsPage />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/automations/:id" element={<AutomationDetailPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/drafts" element={<MarketplaceDraftsPage />} />
              <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/workflows" element={<WorkflowLibrary />} />
              <Route path="/workflows/build" element={<WorkflowBuilder />} />
              <Route path="/workflows/:id" element={<WorkflowDetail />} />
              <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
              <Route path="/battle" element={<BattleModeLanding />} />
              <Route path="/battle/setup" element={<BattleModeSetup />} />
              <Route path="/battle/arena" element={<BattleModeArena />} />
              <Route path="/battle/winner" element={<BattleModeWinner />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          </PageTransition>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
