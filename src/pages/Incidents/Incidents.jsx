import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import IncidentCard from '../../components/incidents/IncidentCard/IncidentCard'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useIncidents } from '../../hooks/useIncidents'
import { useBuildings } from '../../hooks/useBuildings'
import { statusLabels } from '../../constants/incidentStatus'
import { normalizeIncidentStatus } from '../../engine/incidentWorkflow'

const PAGE_SIZE = 10
const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
const groupOrder = { open: 0, active: 1, completed: 2 }
const activeStatuses = new Set([
  'DISPATCHED',
  'IN_TRANSIT',
  'ON_SITE',
  'IN_DIAGNOSIS',
  'IN_MAINTENANCE',
  'AWAITING_RESOURCE',
  'AWAITING_THIRD_PARTY',
])
const completedStatuses = new Set(['RESOLVED', 'CLOSED', 'CANCELLED'])

function incidentGroup(incident) {
  const normalizedStatus = normalizeIncidentStatus(incident.status)
  if (completedStatuses.has(normalizedStatus)) return 'completed'
  if (activeStatuses.has(normalizedStatus)) return 'active'
  return 'open'
}

function Incidents() {
  const { incidents } = useIncidents()
  const { buildings } = useBuildings()
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('all')
  const [status, setStatus] = useState('all')
  const [group, setGroup] = useState('open')
  const [sort, setSort] = useState('priority')
  const [page, setPage] = useState(1)

  const groupCounts = useMemo(
    () =>
      incidents.reduce(
        (counts, incident) => {
          counts[incidentGroup(incident)] += 1
          counts.all += 1
          return counts
        },
        { all: 0, open: 0, active: 0, completed: 0 },
      ),
    [incidents],
  )

  const filtered = useMemo(
    () => {
      const result = incidents.filter((incident) => {
        const normalizedStatus = normalizeIncidentStatus(incident.status)
        const matchesQuery = `${incident.id} ${incident.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
        return (
          matchesQuery &&
          (group === 'all' || incidentGroup(incident) === group) &&
          (priority === 'all' || incident.priority === priority) &&
          (status === 'all' || normalizedStatus === status)
        )
      })

      return result.sort((first, second) => {
        if (sort === 'recent') {
          return new Date(second.createdAt) - new Date(first.createdAt)
        }
        if (sort === 'sla') {
          const firstDue = new Date(first.createdAt).getTime() + first.slaMinutes * 60000
          const secondDue = new Date(second.createdAt).getTime() + second.slaMinutes * 60000
          return firstDue - secondDue
        }
        return (
          groupOrder[incidentGroup(first)] - groupOrder[incidentGroup(second)] ||
          (priorityOrder[first.priority] ?? 4) - (priorityOrder[second.priority] ?? 4) ||
          (second.priorityScore || 0) - (first.priorityScore || 0)
        )
      })
    },
    [group, incidents, priority, query, sort, status],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleIncidents = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const resetPage = () => setPage(1)

  return (
    <PageContainer
      title="Ocorrências"
      description="Use a busca ou os filtros para encontrar um atendimento."
      actions={
        <Link className="primary-action" to="/incidents/new">
          Nova ocorrência
        </Link>
      }
    >
      <div className="incident-view-tabs" aria-label="Situação das ocorrências">
        {[
          ['open', 'Em aberto'],
          ['active', 'Em atendimento'],
          ['completed', 'Concluídas'],
          ['all', 'Todas'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={group === value ? 'active' : ''}
            aria-pressed={group === value}
            onClick={() => {
              setGroup(value)
              resetPage()
            }}
          >
            {label} <span>{groupCounts[value]}</span>
          </button>
        ))}
      </div>

      <section className="incident-filters" aria-label="Filtros de ocorrências">
        <input
          className="ui-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            resetPage()
          }}
          placeholder="Buscar por ID ou descrição"
          aria-label="Buscar ocorrência"
        />
        <select
          className="ui-input"
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value)
            resetPage()
          }}
          aria-label="Filtrar por prioridade"
        >
          <option value="all">Todas as prioridades</option>
          <option value="critical">Crítica</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
        <select
          className="ui-input"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            resetPage()
          }}
          aria-label="Filtrar por status"
        >
          <option value="all">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="ui-input"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value)
            resetPage()
          }}
          aria-label="Ordenar ocorrências"
        >
          <option value="priority">Mais urgentes</option>
          <option value="recent">Mais recentes</option>
          <option value="sla">Prazo mais próximo</option>
        </select>
      </section>

      {filtered.length > 0 && (
        <div className="incident-list-header" aria-hidden="true">
          <span>Prioridade</span>
          <span>Ocorrência</span>
          <span>Local</span>
          <span>Status</span>
          <span>Ação</span>
        </div>
      )}

      <div className="incident-grid">
        {filtered.length ? (
          visibleIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              building={buildings.find((item) => item.id === incident.buildingId)}
            />
          ))
        ) : (
          <EmptyState
            title="Nenhuma ocorrência encontrada"
            description="Ajuste os filtros ou crie uma nova ocorrência."
          />
        )}
      </div>

      {filtered.length > 0 && (
        <nav className="incident-pagination" aria-label="Paginação das ocorrências">
          <p>
            Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
          </p>
          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {pageCount}
            </span>
            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Próxima
            </button>
          </div>
        </nav>
      )}
    </PageContainer>
  )
}
export default Incidents
