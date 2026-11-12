import { statusLabels } from '../../../constants/incidentStatus'
function IncidentTimeline({ events }) {
  return (
    <ol className="incident-timeline">
      {events
        .slice()
        .reverse()
        .map((event) => (
          <li key={event.id}>
            <time>{event.timestamp.replace('T', ' ').slice(0, 16)}</time>
            <div>
              <strong>{event.description}</strong>
              <span>
                {event.from
                  ? `${statusLabels[event.from] || event.from} → ${statusLabels[event.to] || event.to}`
                  : statusLabels[event.to] || event.to}
              </span>
              <small>{event.user} · origem: operação supervisionada</small>
            </div>
          </li>
        ))}
    </ol>
  )
}
export default IncidentTimeline
