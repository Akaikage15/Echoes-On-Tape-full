import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { ReleasesPage } from './pages/ReleasesPage';
import { ReleaseDetailPage } from './pages/ReleaseDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ExclusivesPage } from './pages/ExclusivesPage';
import { AccountPage } from './pages/AccountPage';
import { PollsPage } from './pages/PollsPage';
import { ProLibraryPage } from './pages/ProLibraryPage';
import { SubmitDemoPage } from './pages/SubmitDemoPage';
import { MerchPage } from './pages/MerchPage';
import { AboutPage } from './pages/AboutPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/release/:id" element={<ReleaseDetailPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artist/:id" element={<ArtistDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/exclusives" element={<ExclusivesPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/pro-library" element={<ProLibraryPage />} />
            <Route path="/submit-demo" element={<SubmitDemoPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}
