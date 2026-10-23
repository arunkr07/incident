import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Overview = lazy(() => import("./pages/Overview"));
const Incidents = lazy(() => import("./pages/Incidents"));
const IncidentInvestigation = lazy(
  () => import("./pages/IncidentInvestigation")
);
const Services = lazy(() => import("./pages/Services"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Logs = lazy(() => import("./pages/Logs"));
const Metrics = lazy(() => import("./pages/Metrics"));
const Deployments = lazy(() => import("./pages/Deployments"));
const DeploymentDetails = lazy(() => import("./pages/DeploymentDetails"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
            Loading Incident...
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Overview />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route
                path="/incidents/:incidentId"
                element={<IncidentInvestigation />}
              />

              <Route path="/services" element={<Services />} />
              <Route
                path="/services/:serviceId"
                element={<ServiceDetails />}
              />

              <Route path="/logs" element={<Logs />} />
              <Route path="/metrics" element={<Metrics />} />

              <Route path="/deployments" element={<Deployments />} />
              <Route
                path="/deployments/:deploymentId"
                element={<DeploymentDetails />}
              />

              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;