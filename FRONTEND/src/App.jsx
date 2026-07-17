import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import PageLoader from "./components/PageLoader.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ShortenPage = lazy(() => import("./pages/ShortenPage.jsx"));
const ProtectedPage = lazy(() => import("./pages/ProtectedPage.jsx"));
const LocationPage = lazy(() => import("./pages/LocationPage.jsx"));
const MyUrls = lazy(() => import("./pages/MyUrls.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Predictions = lazy(() => import("./pages/Predictions.jsx"));
const QRGenerator = lazy(() => import("./pages/QRGenerator.jsx"));
const AIPreview = lazy(() => import("./pages/AIPreview.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/errors/NotFound.jsx"));

export default function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shorten" element={<ShortenPage />} />
              <Route path="/protected-link" element={<ProtectedPage />} />
              <Route path="/location-link" element={<LocationPage />} />
              <Route path="/my-urls" element={<MyUrls />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/analytics/:id" element={<Analytics />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/qr-generator" element={<QRGenerator />} />
              <Route path="/ai-preview" element={<AIPreview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
