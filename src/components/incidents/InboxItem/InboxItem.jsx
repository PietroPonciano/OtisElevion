import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { SearchAlertIcon } from '@hugeicons/core-free-icons'

import Badge from '../../ui/Badge/Badge'
import IncidentCompleteness from '../IncidentCompleteness/IncidentCompleteness'
import SlaIndicator from '../SlaIndicator/SlaIndicator'

import { priorityLabel } from '../../../constants/priority'

function InboxItem({ entry, building, equipment }) {
  const {
    incident,
    missing,
    stateLabel,
    nextAction,
    recurrence,
  } = entry

  return (
    <article className="inbox-item">
      <div className="inbox-item__header">
        <div>
          <strong>{incident.id}</strong>

          <span>
            {incident.intake?.channel ||
              incident.source ||
              'Canal não informado'}
          </span>
        </div>

        <Badge tone={incident.priority}>
          {priorityLabel(incident.priority)}
        </Badge>
      </div>

      <h3>
        {incident.description ||
          'Descrição não informada'}
      </h3>

      <p>
        {building?.name ||
          'Local não informado'}{' '}
        ·{' '}
        {equipment?.id ||
          'Equipamento não informado'}
      </p>

      {recurrence?.isRecurrent && (
        <p className="inbox-item__recurrence">
          <HugeiconsIcon
            icon={SearchAlertIcon}
            size={18}
          />

          <span>
            Recorrência identificada ·{' '}
            {recurrence.reason}
          </span>
        </p>
      )}

      <div className="inbox-item__meta">
        <span>{stateLabel}</span>

        {missing.length > 0 && (
          <span>
            {missing.length} informação(ões)
            faltante(s)
          </span>
        )}
      </div>

      <SlaIndicator incident={incident} />

      <IncidentCompleteness
        incident={incident}
        compact
      />

      <footer>
        <strong>
         {nextAction}
        </strong>

        <Link to={`/incidents/${incident.id}`}>
          Revisar
        </Link>
      </footer>
    </article>
  )
}

export default InboxItem
