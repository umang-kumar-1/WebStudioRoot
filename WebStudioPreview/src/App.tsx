import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useStore } from './store 2';
import { PreviewArea } from './components/PreviewArea';
import './App.css';

function App() {
  const { themeConfig, siteConfig } = useStore();

  // Apply theme variables to root
  useEffect(() => {
    Object.entries(themeConfig).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Handle Font Import dynamically (matches Web Studio behavior)
    const fontImportUrl = themeConfig['--font-import-url'];
    const existingLink = document.getElementById('dynamic-font-import') as HTMLLinkElement | null;

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

    // Also apply specific site config variables
    if (siteConfig?.headerBackgroundColor) {
      let resolvedHeaderBg = siteConfig.headerBackgroundColor;
      if (resolvedHeaderBg === 'site-color' || resolvedHeaderBg === 'site' || resolvedHeaderBg === 'sitecolor') {
        resolvedHeaderBg = themeConfig['--primary-color'] || '#2f5596';
      }
      document.documentElement.style.setProperty('--header-bg', resolvedHeaderBg);
    }
  }, [themeConfig, siteConfig?.headerBackgroundColor]);

  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 text-gray-900 border-x border-gray-100 mx-auto max-w-[1920px]">
        <PreviewArea />
      </div>
    </BrowserRouter>
  );
}

export default App;

