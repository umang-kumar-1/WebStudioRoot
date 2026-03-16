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

