import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { PreviewArea } from './PreviewArea';
import { ModalManager } from './Modals';
import { useStore } from '../store';
import { useSPContext } from '../contexts/SPServiceContext';

// Hook to sync zustand state to CSS Variables on :root
const useThemeSync = () => {
  const themeConfig = useStore((state) => state.themeConfig);

  useEffect(() => {
    // 1. Apply all variables to the document root
    const root = document.documentElement;
    Object.entries(themeConfig).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });

    // 2. Handle Font Import dynamically
    const fontImportUrl = themeConfig['--font-import-url'];
    const existingLink = document.getElementById('dynamic-font-import') as HTMLLinkElement;

    if (fontImportUrl) {
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'dynamic-font-import';
        link.rel = 'stylesheet';
        link.href = fontImportUrl;
        document.head.appendChild(link);
      } else if (existingLink.href !== fontImportUrl) {
        existingLink.href = fontImportUrl;
      }
    } else if (existingLink) {
      existingLink.remove();
    }

  }, [themeConfig]);
};

const App: React.FC = () => {
  // Initialize Global Styles
  useThemeSync();

  // Get SharePoint context
  const { isInitialized } = useSPContext();

  // Load SharePoint data on mount (only after initialization)
  const loadFromSharePoint = useStore((state) => state.loadFromSharePoint);
  const isLoading = useStore((state) => state.isLoading);
  const pages = useStore((state) => state.pages);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Only load data after SharePoint is initialized
    if (isInitialized) {
      console.log('📊 SharePoint initialized, loading data...');
      loadFromSharePoint();
    }
  }, [isInitialized, loadFromSharePoint]);

  // Routing Logic: Listen for Hash Changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      const matchedPage = pages.find(p => p.slug === hash);
      if (matchedPage) {
        // Prevent infinite loop by checking if it's already the current page in store
        // setCurrentPage already has a hash check, but let's be safe
        setCurrentPage(matchedPage.id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial check when pages are loaded
    if (pages.length > 0) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pages, setCurrentPage]);

  return (
    <div className="flex h-screen w-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-center">
              <p className="text-gray-800 font-bold text-lg mb-1">Loading Data...</p>
              <p className="text-gray-500 text-sm">
                Loading pages, navigation, news, events, and settings...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (Preview) */}
      <main className="flex-1 flex flex-col h-full relative">
        <PreviewArea />
      </main>

      {/* Global Modals */}
      <ModalManager />
    </div>
  );
};

export default App;