// Gera um chamado aleatório e coerente para a simulação.
//
// A tela é estática (os dados vêm de snapshot.json, já calculados). Para que o chamado
// novo funcione em todas as abas (visão geral, decisão e plano, histórico), ele nasce
// de um chamado real do snapshot sorteado como modelo: herda local, equipamento, relato,
// categoria, prioridade e a decisão já calculada, e ganha identidade própria (número,
// solicitante, telefone, horário de entrada) e o estado "Aguardando classificação".
import { incidents as baseIncidents, decisions as baseDecisions, REFERENCE_NOW } from './static'
import { getSlaStatus } from '../utils/sla'

const requesters = [
  'Marina Duarte',
  'Rafael Teixeira',
  'Luciana Prado',
  'Eduardo Salgado',
  'Patrícia Nogueira',
  'Thiago Bastos',
  'Camila Rezende',
  'Gustavo Ferraz',
  'Juliana Amaral',
  'Roberto Meireles',
  'Zeladoria do prédio',
  'Portaria principal',
]

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
const clone = (value) => JSON.parse(JSON.stringify(value))
const pad = (number) => String(number).padStart(2, '0')

// Mesmo formato usado no snapshot ("2026-08-26T10:05:00"), em horário local.
function toLocalIso(ms) {
  const date = new Date(ms)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const randomPhone = () => `(31) 9${randomInt(8000, 9999)}-${randomInt(1000, 9999)}`

function nextIncidentId(existingIds) {
  const highest = existingIds.reduce((max, id) => {
    const number = Number(String(id).replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 10000)
  return `INC-${highest + 1}`
}

/**
 * Sorteia um chamado novo. Devolve tudo o que as telas precisam:
 * - incident: o chamado em si, em "Aguardando classificação";
 * - decision: a decisão (classificação, prioridade, ranking, plano, ETA);
 * - inboxEntry: a linha equivalente na Central de Controle.
 */
export function buildRandomIncident(existingIds = baseIncidents.map((item) => item.id)) {
  const template = pick(baseIncidents)
  const templateDecision = baseDecisions[template.id]

  const id = nextIncidentId(existingIds)
  const receivedAt = toLocalIso(REFERENCE_NOW - randomInt(2, 10) * 60000)
  const requester = pick(requesters)
  const phone = randomPhone()

  const information = clone(template.information ?? {})
  const setKnown = (field, value) => {
    information[field] = { value, source: 'reported', confidence: null }
  }
  setKnown('channel', 'Assistente de IA')
  setKnown('requester', requester)
  setKnown('phone', phone)

  const incident = {
    ...clone(template),
    id,
    createdAt: receivedAt,
    updatedAt: receivedAt,
    status: 'AWAITING_CLASSIFICATION',
    source: 'Assistente de IA',
    requester,
    phone,
    assignedTechnicianId: null,
    information,
    intake: {
      channel: 'Assistente de IA',
      receivedAt,
      originalMessage: template.description,
    },
    classification: null,
    priorityDecision: null,
    risk: { value: null, source: 'unknown', confidence: null },
    plan: null,
    approvals: { planApprovedAt: null, approvedBy: null },
    timestamps: { receivedAt },
    timeline: [
      {
        id: `TL-${id}-RECEIVED`,
        timestamp: receivedAt,
        user: 'Assistente de IA',
        action: 'RECEIVED',
        description: 'Ocorrência registrada pelo assistente de IA',
        from: null,
        to: 'AWAITING_CLASSIFICATION',
      },
    ],
    diagnosis: null,
    resolutionDetails: null,
    resourcesUsed: [],
  }
  delete incident.assignmentSnapshot

  // A decisão do modelo cita o número do chamado antigo (ex.: no resumo). Troca só nesse
  // bloco, para não mexer no histórico de recorrência, que tem números de outros chamados.
  const decision = clone(templateDecision)
  decision.briefing = JSON.parse(JSON.stringify(decision.briefing).split(template.id).join(id))
  decision.incident = clone(incident)
  decision.known = clone(information)

  const sla = getSlaStatus(incident)
  const inboxEntry = {
    incident,
    missing: [],
    sla: {
      age: sla.elapsedMinutes,
      remaining: sla.remainingMinutes,
      state: sla.state,
      formatted: sla.formatted,
      label: sla.label,
    },
    recurrence: decision.recurrence,
    stateLabel: 'Aguardando classificação',
    nextAction: 'Confirmar classificação',
  }

  return { incident, decision, inboxEntry }
}
