import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../components/layout/AppShell/AppShell'
import ControlCenter from '../pages/ControlCenter/ControlCenter'
import IncidentDetails from '../pages/Incidents/IncidentDetails'
import Incidents from '../pages/Incidents/Incidents'
import NewIncident from '../pages/NewIncident/NewIncident'
import Resolution from '../pages/Resolution/Resolution'
import Areas from '../pages/Areas/Areas'
import AreaDetails from '../pages/Areas/AreaDetails'
import Audit from '../pages/Audit/Audit'
import Equipment from '../pages/Equipment/Equipment'
import EquipmentDetails from '../pages/Equipment/EquipmentDetails'
import Reports from '../pages/Reports/Reports'
import Settings from '../pages/Settings/Settings'
import Technicians from '../pages/Technicians/Technicians'
import TechnicianDetails from '../pages/Technicians/TechnicianDetails'
import OperationsMap from '../pages/OperationsMap/OperationsMap'
const Analytics = lazy(() => import('../pages/Analytics/Analytics'))
function AppRoutes() {
  return (
    <AppShell>
      <Suspense fallback={<main className="route-loading">Carregando módulo...</main>}>
        <Routes>
          <Route path="/" element={<Navigate to="/control-center" replace />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/new" element={<NewIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetails />} />
          <Route path="/resolution" element={<Resolution />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/areas/:id" element={<AreaDetails />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/technicians/:id" element={<TechnicianDetails />} />
          <Route path="/operations-map" element={<OperationsMap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* O acompanhamento em campo (deslocamento, chegada, diagnóstico) passou a vir
              de um aplicativo externo do técnico, sincronizado via dataSourceService
              (evento otis-flow:data-synced). Não existe mais uma versão espelhada
              dessas telas dentro do painel do operador. */}
          <Route path="*" element={<Navigate to="/control-center" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
export default AppRoutes
