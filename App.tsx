
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ClinicPage from './components/ClinicPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* London Routes */}
        <Route path="/london/*" element={<ClinicPage key="london" locationId="london" />} />

        {/* Glasgow Routes */}
        <Route path="/glasgow/*" element={<ClinicPage key="glasgow" locationId="glasgow" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
