import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider } from './store/CRMContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EnquiryList from './pages/EnquiryList';
import EnquiryDetail from './pages/EnquiryDetail';
import Pipeline from './pages/Pipeline';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import Payments from './pages/Payments';
import PaymentDetail from './pages/PaymentDetail';
import Reports from './pages/Reports';
import BudgetReport from './pages/BudgetReport';
import FollowUps from './pages/FollowUps';
import Destinations from './pages/Destinations';
import Notifications from './pages/Notifications';

export default function App() {
  return (
    <CRMProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/enquiries" element={<EnquiryList />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/enquiries/new" element={<Navigate to="/enquiries" replace />} />
            <Route path="/enquiries/:id" element={<EnquiryDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:id" element={<PaymentDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/budget" element={<BudgetReport />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CRMProvider>
  );
}
