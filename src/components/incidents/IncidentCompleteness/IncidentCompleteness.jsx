import Badge from '../../ui/Badge/Badge'
import Progress from '../../ui/Progress/Progress'
import { getInformationEntry } from '../../../utils/incident'

const fields = [
  { key: 'buildingId', label: 'Local' },
  { key: 'equipmentId', label: 'Equipamento' },
  { key: 'description', label: 'Problema relatado' },
  { key: 'channel', label: 'Canal' },
  { key: 'requester', label: 'Solicitante' },
  { key: 'phone', label: 'Contato' },
  { key: 'passengers', label: 'Passageiros' },
  { key: 'safetyCondition', label: 'Condição de segurança' },
  { key: 'situationCode', label: 'Código operacional' },
]
const sourceLabel = {
  reported: 'Informado',
  inferred: 'Estimativa do protótipo',
  unknown: 'Não informado',
}

function IncidentCompleteness({ incident, compact = false }) {
  const entries = fields.map((field) => ({
    ...field,
    entry: getInformationEntry(incident, field.key),
  }))
  const known = entries.filter((item) => item.entry.source !== 'unknown').length
  const percentage = Math.round((known / entries.length) * 100)
  if (compact)
    return (
      <div className="completeness-compact">
        <div>
          <strong>Completude</strong>
          <span>
            {known} de {entries.length} informações
          </span>
        </div>
        <Progress value={percentage} label={`Completude da ocorrência: ${percentage}%`} />
        <b>{percentage}%</b>
      </div>
    )
  return (
    <section className="completeness">
      <header>
        <div>
          <p className="eyebrow">Informações da ocorrência</p>
          <h2>Completude</h2>
        </div>
        <strong>{percentage}%</strong>
      </header>
      <Progress value={percentage} label={`Completude da ocorrência: ${percentage}%`} />
      <p className="completeness__summary">
        {known} de {entries.length} informações disponíveis
      </p>
      <ul>
        {entries.map(({ key, label, entry }) => (
          <li key={key} className={`completeness__${entry.source}`}>
            <span>
              {entry.source === 'unknown' ? '?' : entry.source === 'inferred' ? '~' : '✓'}
            </span>
            <div>
              <strong>{label}</strong>
              <small>{sourceLabel[entry.source]}</small>
            </div>
            {entry.source === 'inferred' && (
              <Badge tone="neutral">{Math.round((entry.confidence || 0) * 100)}% confiança</Badge>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default IncidentCompleteness
