import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Plans from "./pages/Plans";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Gurus from "./pages/Gurus";
import Books from "./pages/Books";
import Quiz from "./pages/Quiz";
import StressProfile from "./pages/StressProfile";
import StressGuru from "./pages/gurus/StressGuru";
import SleepGuru from "./pages/gurus/SleepGuru";
import AnxietyGuru from "./pages/gurus/AnxietyGuru";
import MotivationGuru from "./pages/gurus/MotivationGuru";
import RelationshipGuru from "./pages/gurus/RelationshipGuru";
import HappinessGuru from "./pages/gurus/HappinessGuru";
import CalmGuru from "./pages/gurus/CalmGuru";
import SpiritualGuru from "./pages/gurus/SpiritualGuru";
import NotFound from "./pages/NotFound";
import AppPage from "./pages/AppPage";
import SleepAgain from "./pages/SleepAgain";
import ScienceAndSafety from "./pages/ScienceAndSafety";
import EditorialPolicy from "./pages/EditorialPolicy";
import Accessibility from "./pages/Accessibility";
import GeneratedContentPage from "./pages/content/GeneratedContentPage";
import { contentPages } from "./data/contentPages.generated";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import GuruManagement from "./pages/admin/GuruManagement";
import AdminLogin from "./pages/admin/Login";
import StressLeads from "./pages/admin/StressLeads";

// Layout wrapper for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin routes - no navigation/footer, handled by AdminLayout */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/blogs" component={BlogList} />
      <Route path="/admin/blogs/new" component={BlogEditor} />
      <Route path="/admin/blogs/:id" component={BlogEditor} />
      <Route path="/admin/gurus" component={GuruManagement} />
      <Route path="/admin/leads" component={StressLeads} />

      {/* Public routes - with navigation/footer */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <Route path="/how-it-works">
        <PublicLayout>
          <HowItWorks />
        </PublicLayout>
      </Route>
      <Route path="/plans">
        <PublicLayout>
          <Plans />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route path="/blogs">
        <PublicLayout>
          <Blogs />
        </PublicLayout>
      </Route>
      <Route path="/blogs/:slug">
        <PublicLayout>
          <BlogDetail />
        </PublicLayout>
      </Route>
      <Route path="/privacy-policy">
        <PublicLayout>
          <PrivacyPolicy />
        </PublicLayout>
      </Route>
      <Route path="/terms-and-conditions">
        <PublicLayout>
          <TermsAndConditions />
        </PublicLayout>
      </Route>
      <Route path="/app">
        <PublicLayout>
          <AppPage />
        </PublicLayout>
      </Route>
      <Route path="/books/sleep-again">
        <PublicLayout>
          <SleepAgain />
        </PublicLayout>
      </Route>
      <Route path="/books">
        <PublicLayout>
          <Books />
        </PublicLayout>
      </Route>
      <Route path="/quiz">
        <PublicLayout>
          <Quiz />
        </PublicLayout>
      </Route>
      <Route path="/stress-profile">
        <PublicLayout>
          <StressProfile />
        </PublicLayout>
      </Route>
      <Route path="/gurus">
        <PublicLayout>
          <Gurus />
        </PublicLayout>
      </Route>
      <Route path="/gurus/stress">
        <PublicLayout>
          <StressGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/sleep">
        <PublicLayout>
          <SleepGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/anxiety">
        <PublicLayout>
          <AnxietyGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/motivation">
        <PublicLayout>
          <MotivationGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/relationship">
        <PublicLayout>
          <RelationshipGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/happiness">
        <PublicLayout>
          <HappinessGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/calm">
        <PublicLayout>
          <CalmGuru />
        </PublicLayout>
      </Route>
      <Route path="/gurus/spiritual">
        <PublicLayout>
          <SpiritualGuru />
        </PublicLayout>
      </Route>
      <Route path="/science-and-safety">
        <PublicLayout>
          <ScienceAndSafety />
        </PublicLayout>
      </Route>
      <Route path="/editorial-policy">
        <PublicLayout>
          <EditorialPolicy />
        </PublicLayout>
      </Route>
      <Route path="/accessibility">
        <PublicLayout>
          <Accessibility />
        </PublicLayout>
      </Route>
      {contentPages.map(page => (
        <Route key={page.url} path={page.url}>
          <PublicLayout>
            <GeneratedContentPage page={page} />
          </PublicLayout>
        </Route>
      ))}
      <Route path="/404">
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
      {/* Final fallback route */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Deployment timestamp: 2026-01-16
export default App;
