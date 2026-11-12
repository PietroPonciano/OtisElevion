import { Link } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import InboxItem from '../../components/incidents/InboxItem/InboxItem'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useOperationalInbox } from '../../hooks/useOperationalInbox'
import { useBuildings } from '../../hooks/useBuildings'
import { useEquipment } from '../../hooks/useEquipment'

// Ordem da fila: define o que aparece primeiro em "O que fazer agora".
const priorityKeys = [
  'slaBreached',
  'critical',
  'slaRisk',
  'incomplete',
  'awaitingClassification',
]

// Ordem dos avisos do resumo: do mais grave para o menos grave.
const summaryOrder = [
  'critical',
  'slaBreached',
  'slaRisk',
  'incomplete',
  'awaitingClassification',
]

// O número é exibido em destaque, então o texto fica sem ele (singular, plural).
const summaryCopy = {
  slaBreached: ['atendimento com prazo excedido', 'atendimentos com prazo excedido'],
  critical: ['caso crítico para revisar', 'casos críticos para revisar'],
  slaRisk: ['atendimento próximo do prazo', 'atendimentos próximos do prazo'],
  incomplete: ['ocorrência precisa de informações', 'ocorrências precisam de informações'],
  awaitingClassification: ['classificação aguarda confirmação', 'classificações aguardam confirmação'],
}

const summaryTones = {
  slaBreached: 'high',
  critical: 'critical',
  slaRisk: 'high',
  incomplete: 'high',
  awaitingClassification: 'neutral',
}

function ControlCenter() {
  const inbox = useOperationalInbox()
  const { buildings } = useBuildings()
  const { equipment } = useEquipment()
  const building = (id) => buildings.find((item) => item.id === id)
  const device = (id) => equipment.find((item) => item.id === id)

  const summaryKeys = summaryOrder.filter((key) => inbox[key].length > 0).slice(0, 3)
  const attentionQueue = priorityKeys
    .flatMap((key) =>
      inbox[key].map((entry) => ({
        ...entry,
        attentionType: key,
      })),
    )
    .slice(0, 4)

  return (
    <PageContainer
      title="Central de Controle"
      description="Veja o que exige atenção e siga a próxima ação indicada."
      actions={
        <Link className="primary-action" to="/incidents/new">
          Nova ocorrência
        </Link>
      }
    >
      <section
        className="attention-summary"
        aria-label="Resumo da atenção necessária"
      >
        {summaryKeys.map((key) => {
          const count = inbox[key].length
          const [singular, plural] = summaryCopy[key]

          return (
            <Link
              key={key}
              className={`attention-summary__item attention-summary__item--${summaryTones[key]}`}
              to={inbox[key][0]
                ? `/incidents/${inbox[key][0].incident.id}`
                : '/incidents'}
            >
              <strong className="attention-summary__count">{count}</strong>
              <span className="attention-summary__label">
                {count === 1 ? singular : plural}
              </span>
              <span className="attention-summary__action">Revisar agora →</span>
            </Link>
          )
        })}
      </section>
      {attentionQueue.length ? (
        <section className="operational-queue">
          <header className="operational-queue__header">
            <div>
              <h2>Fila priorizada</h2>
              <p>O que fazer agora, da maior para a menor prioridade</p>
            </div>

            <Link to="/incidents">Ver todas</Link>
          </header>

          <div className="operational-queue__list">
            <div className="operational-queue__columns" aria-hidden="true">
              <span>Ocorrência</span>
              <span>Descrição e local</span>
              <span>Próxima ação</span>
            </div>
            {attentionQueue.map((entry) => (
              <InboxItem
                key={entry.incident.id}
                entry={entry}
                building={building(entry.incident.buildingId)}
                equipment={device(entry.incident.equipmentId)}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Nenhuma atenção operacional pendente"
          description="A fila está estabilizada. Novas ocorrências aparecerão aqui."
          action={
            <Link className="primary-action" to="/incidents/new">
              Registrar ocorrência
            </Link>
          }
        />
      )}
    </PageContainer>
  )
}

export default ControlCenter