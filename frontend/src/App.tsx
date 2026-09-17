import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import Incidents from "./pages/Incidents";
import IncidentInvestigation from "./pages/IncidentInvestigation";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Logs from "./pages/Logs";
import Metrics from "./pages/Metrics";
import Deployments from "./pages/Deployments";
import DeploymentDetails from "./pages/DeploymentDetails";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;