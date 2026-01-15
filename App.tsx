import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import Community from './pages/Community';
import Store from './pages/Store';
import Services from './pages/Services';
import Settings from './pages/Settings';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import PetDetails from './pages/PetDetails';
import LostAndFound from './pages/LostAndFound';
import RainbowBridge from './pages/RainbowBridge';
import Adoption from './pages/Adoption';
import Discovery from './pages/Discovery';
import CareServices from './pages/CareServices';
import Events from './pages/Events';
import HelpBoard from './pages/HelpBoard';
import Playdates from './pages/Playdates';
import Messages from './pages/Messages';
import CareCircles from './pages/CareCircles';
import MemoryVault from './pages/MemoryVault';

// Helper component to handle scrolling
const AppBehavior: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const userProfile = localStorage.getItem('userProfile');
  if (!userProfile) {
    return <Navigate to="/settings" replace />;
  }
  return children;
};

// Root Route Logic - Automatically go to Dashboard if profile exists
const RootRoute: React.FC = () => {
  const userProfile = localStorage.getItem('userProfile');
  return userProfile ? <Navigate to="/dashboard" replace /> : <Navigate to="/settings" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AppBehavior />
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
            <Route path="/edit-pet/:id" element={<ProtectedRoute><EditPet /></ProtectedRoute>} />
            <Route path="/pet/:id" element={<ProtectedRoute><PetDetails /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/lost-and-found" element={<ProtectedRoute><LostAndFound /></ProtectedRoute>} />
            <Route path="/rainbow-bridge" element={<ProtectedRoute><RainbowBridge /></ProtectedRoute>} />
            <Route path="/adoption" element={<ProtectedRoute><Adoption /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/care-services" element={<ProtectedRoute><CareServices /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/help-board" element={<ProtectedRoute><HelpBoard /></ProtectedRoute>} />
            <Route path="/playdates" element={<ProtectedRoute><Playdates /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/care-circles" element={<ProtectedRoute><CareCircles /></ProtectedRoute>} />
            <Route path="/memory-vault" element={<ProtectedRoute><MemoryVault /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;