import { Link } from 'react-router-dom'
import Badge from '../../ui/Badge/Badge'
import { priorityLabel } from '../../../constants/priority'
import { statusLabels } from '../../../constants/incidentStatus'
import { normalizeIncidentStatus } from '../../../engine/incidentWorkflow'

const actionLabels = {
  AWAITING_CLASSIFICATION: 'Classificar',
  AWAITING_INFORMATION: 'Completar dados',
  CLASSIFIED: 'Revisar decisão',
  PLAN_PENDING: 'Revisar plano',
  PLAN_APPROVED: 'Preparar despacho',
  READY_TO_DISPATCH: 'Despachar',
  DISPATCHED: 'Acompanhar',
  IN_TRANSIT: 'Acompanhar',
  ON_SITE: 'Acompanhar',
  IN_DIAGNOSIS: 'Acompanhar',
  IN_MAINTENANCE: 'Acompanhar',
  AWAITING_RESOURCE: 'Acompanhar',
  AWAITING_THIRD_PARTY: 'Acompanhar',
  RESOLVED: 'Ver detalhes',
  CLOSED: 'Ver detalhes',
  CANCELLED: 'Ver detalhes',
}

function IncidentCard({ incident, building }) {
  const normalizedStatus = normalizeIncidentStatus(incident.status)
  const actionLabel = actionLabels[normalizedStatus] || 'Abrir ocorrência'
  const isCriticalOpen =
    incident.priority === 'critical' &&
    !['RESOLVED', 'CLOSED', 'CANCELLED'].includes(normalizedStatus)

  return (
    <article
      className={`incident-card ${isCriticalOpen ? 'incident-card--critical' : ''}`}
    >
      <div className="incident-card__top">
        <span>{incident.id}</span>
        <Badge tone={incident.priority}>{priorityLabel(incident.priority)}</Badge>
      </div>
      <h2>{incident.description}</h2>
      <p>{building?.name || 'Local não informado'}</p>
      <div className="incident-card__status">
        <Badge tone="neutral">{statusLabels[normalizedStatus] || normalizedStatus}</Badge>
      </div>
      <footer>
        <Link to={`/incidents/${incident.id}`}>{actionLabel} →</Link>
      </footer>
    </article>
  )
}
export default IncidentCard
