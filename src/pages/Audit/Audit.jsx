import { Link } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import IncidentTimeline from '../../components/incidents/IncidentTimeline/IncidentTimeline'
import { useAudit } from '../../hooks/useAudit'
import { useIncidents } from '../../hooks/useIncidents'
import { useIncidentDecision } from '../../hooks/useIncidentDecision'
import { statusLabels } from '../../constants/incidentStatus'
import { normalizeIncidentStatus } from '../../engine/incidentWorkflow'

function CriticalCase({ incident }) {
  const decision = useIncidentDecision(incident)
  return (
    <article className="critical-case">
      <header>
        <div>
          <strong>{incident.id}</strong>
          <span>{incident.description}</span>
        </div>
        <Badge tone="critical">Crítica</Badge>
      </header>
      <div className="critical-case__context">
        <span>
          Passageiros: {incident.passengers === null ? 'Não informado' : incident.passengers}
        </span>
        <span>Lacunas: {decision.missingInformation.length}</span>
        <span>Recorrência: {decision.recurrence.count}</span>
        <span>
          Estado: {statusLabels[normalizeIncidentStatus(incident.status)] || 'Não informado'}
        </span>
      </div>
      <IncidentTimeline events={incident.timeline} />
      <footer>
        <Link to={`/incidents/${incident.id}`}>Reconstruir decisão completa</Link>
      </footer>
    </article>
  )
}

function Audit() {
  const { events } = useAudit()
  const { incidents } = useIncidents()
  const critical = incidents.filter((incident) => incident.priority === 'critical')
  return (
    <PageContainer
      title="Auditoria de segurança"
      description="Reconstrua decisões críticas, lacunas, responsáveis e resultado, dados demonstrativos."
    >
      <section className="metric-grid">
        {[
          { label: 'Casos críticos', value: critical.length },
          {
            label: 'Passageiros informados',
            value: critical.filter((item) => Number(item.passengers) > 0).length,
          },
          {
            label: 'Com lacunas',
            value: critical.filter((item) => !item.safetyCondition || item.passengers === null)
              .length,
          },
          { label: 'Eventos auditados', value: events.length },
        ].map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
      <section className="audit-cases">
        <h2>Casos que exigem análise</h2>
        {critical.length ? (
          critical.map((incident) => <CriticalCase key={incident.id} incident={incident} />)
        ) : (
          <EmptyState title="Nenhum caso crítico registrado" />
        )}
      </section>
      <Card title="Eventos recentes de auditoria">
        <ol className="audit-list">
          {events.slice(0, 12).map((event) => (
            <li key={event.id}>
              <strong>{event.action}</strong>
              <span>{event.description}</span>
              <small>
                {event.timestamp.replace('T', ' ').slice(0, 16)} · {event.user}
              </small>
            </li>
          ))}
        </ol>
      </Card>
    </PageContainer>
  )
}
export default Audit
