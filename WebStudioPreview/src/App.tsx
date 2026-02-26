import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useStore } from './store';
import { PreviewArea } from './components/PreviewArea';
import './App.css';

function App() {
  const { themeConfig } = useStore();

  // Apply theme variables to root
  useEffect(() => {
    Object.entries(themeConfig).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [themeConfig]);

  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 text-gray-900 border-x border-gray-100 mx-auto max-w-[1920px]">
        <PreviewArea />
      </div>
    </BrowserRouter>
  );
}

export default App;

