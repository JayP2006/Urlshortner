import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import Login from './components/loginForm';
import Register from './components/registerForm';
import Home from './components/home';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 import this

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urlshort" element={
          <ProtectedRoute>
            <UrlShortener />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
