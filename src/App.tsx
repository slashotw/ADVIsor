import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Groups } from './pages/Groups';
import { OrganizationalUnits } from './pages/OrganizationalUnits';
import { Permissions } from './pages/Permissions';
import { Visualization } from './pages/Visualization';
import { Workflows } from './pages/Workflows';
import { SelfService } from './pages/SelfService';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';
import { ApiTest } from './pages/ApiTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/organizational-units" element={<OrganizationalUnits />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/self-service" element={<SelfService />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
