import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { FreelancerApplyModal } from './components/FreelancerApplyModal';
import { CartDrawer } from './components/CartDrawer';
import { VideoModal } from './components/VideoModal';
import { CheckCircle2 } from 'lucide-react';

import { HomePage } from './pages/HomePage';
import { SoftwareCatalogPage } from './pages/SoftwareCatalogPage';
import { SoftwareDetailPage } from './pages/SoftwareDetailPage';
import { EcommerceStorePage } from './pages/EcommerceStorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FreelancerDirectoryPage } from './pages/FreelancerDirectoryPage';
import { FreelancerDetailPage } from './pages/FreelancerDetailPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

const AppContent = () => {
  const { toastMessage } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, background: 'var(--modal-bg)', border: '1px solid #cb0c9f', color: 'var(--text-primary)', padding: '12px 20px', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.2s ease-out' }}>
          <CheckCircle2 size={18} color="#cb0c9f" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphism Header */}
      <Navbar />

      {/* Main Content Area - React Router */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/software" element={<SoftwareCatalogPage />} />
          <Route path="/software/:id" element={<SoftwareDetailPage />} />
          <Route path="/store" element={<EcommerceStorePage />} />
          <Route path="/store/:id" element={<ProductDetailPage />} />
          <Route path="/freelancers" element={<FreelancerDirectoryPage />} />
          <Route path="/freelancers/:id" element={<FreelancerDetailPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <QuoteModal />
      <FreelancerApplyModal />
      <CartDrawer />
      <VideoModal />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
