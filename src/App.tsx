
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Set this to true to bypass authentication (for development)
const BYPASS_AUTH = true;

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={BYPASS_AUTH ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={BYPASS_AUTH ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              BYPASS_AUTH ? (
                <Dashboard />
              ) : (
                <ProtectedRoute role="user">
                  <Dashboard />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/admin"
            element={
              BYPASS_AUTH ? (
                <AdminDashboard />
              ) : (
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              )
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

export default App;
