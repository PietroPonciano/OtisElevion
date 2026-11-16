// Guarda os chamados criados durante a simulação e os mescla aos dados fixos do snapshot.
// É um store mínimo (subscribe/getSnapshot) para ser usado com useSyncExternalStore, de modo
// que lista, detalhe e Central de Controle atualizem sozinhos quando um chamado é criado.
// Os chamados criados ficam no localStorage, então sobrevivem a um F5.
import { incidents as baseIncidents, decisions as baseDecisions, inbox as baseInbox } from './static'
import { buildRandomIncident } from './randomIncident'

const STORAGE_KEY = 'otis-simulacao:chamados-criados'
const listeners = new Set()

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((entry) => entry?.incident?.id && entry.decision) : []
  } catch {
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created))
  } catch {
    // Sem armazenamento disponível: o chamado continua valendo até recarregar a página.
  }
}

// Em qual(is) grupo(s) da Central de Controle o chamado novo aparece.
function inboxGroups(entry) {
  const groups = ['awaitingClassification']
  if (entry.incident.priority === 'critical') groups.push('critical')
  if (entry.sla.state === 'risk') groups.push('slaRisk')
  if (entry.sla.state === 'breached') groups.push('slaBreached')
  return groups
}

function compute() {
  const decisions = { ...baseDecisions }
  const inbox = Object.fromEntries(Object.entries(baseInbox).map(([key, list]) => [key, [...list]]))
  // O mais recente fica no topo de cada lista.
  for (const entry of [...created].reverse()) {
    decisions[entry.incident.id] = entry.decision
    for (const group of inboxGroups(entry.inboxEntry)) inbox[group]?.unshift(entry.inboxEntry)
  }
  return {
    incidents: [...created.map((entry) => entry.incident), ...baseIncidents],
    decisions,
    inbox,
  }
}

let created = load()
let snapshot = compute()

export const subscribeIncidents = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Retorna sempre o mesmo objeto até algo mudar (exigência do useSyncExternalStore).
export const getIncidentsSnapshot = () => snapshot

/** Cria um chamado aleatório, adiciona ao sistema e devolve o chamado criado. */
export function createRandomIncident() {
  const entry = buildRandomIncident(snapshot.incidents.map((item) => item.id))
  created = [entry, ...created]
  snapshot = compute()
  persist()
  listeners.forEach((listener) => listener())
  return entry.incident
}

/** Remove os chamados criados na simulação (volta ao snapshot original). */
export function clearCreatedIncidents() {
  created = []
  snapshot = compute()
  persist()
  listeners.forEach((listener) => listener())
}
