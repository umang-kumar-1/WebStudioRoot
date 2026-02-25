import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useStore } from './store';
import { PreviewArea } from './components/PreviewArea';
import './App.css';
import Test from './components/Test';
import MediaLibrary from './components/MediaLibrary';

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
      <PreviewArea />
      <Test />
      <MediaLibrary />
    </BrowserRouter>
  );
}

export default App;

