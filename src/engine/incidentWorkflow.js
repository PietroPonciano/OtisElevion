import { incidentStatuses, legacyStatusMap, statusLabels } from '../constants/incidentStatus'

const transitions = {
  START_CLASSIFICATION: {
    from: [incidentStatuses.RECEIVED],
    to: incidentStatuses.AWAITING_CLASSIFICATION,
    label: 'Classificação iniciada',
    timestamp: 'classificationStartedAt',
  },
  REQUEST_INFORMATION: {
    from: [incidentStatuses.AWAITING_CLASSIFICATION, incidentStatuses.PLAN_PENDING],
    to: incidentStatuses.AWAITING_INFORMATION,
    label: 'Informações adicionais solicitadas',
  },
  COMPLETE_CLASSIFICATION: {
    from: [incidentStatuses.AWAITING_CLASSIFICATION],
    to: incidentStatuses.CLASSIFIED,
    label: 'Classificação confirmada',
    timestamp: 'classifiedAt',
  },
  UPDATE_INFORMATION: {
    from: [incidentStatuses.AWAITING_INFORMATION],
    to: incidentStatuses.AWAITING_CLASSIFICATION,
    label: 'Informações atualizadas',
  },
  CREATE_PLAN: {
    from: [incidentStatuses.CLASSIFIED],
    to: incidentStatuses.PLAN_PENDING,
    label: 'Plano de atendimento criado',
    timestamp: 'planCreatedAt',
  },
  APPROVE_PLAN: {
    from: [incidentStatuses.PLAN_PENDING],
    to: incidentStatuses.PLAN_APPROVED,
    label: 'Plano de atendimento aprovado',
    timestamp: 'planApprovedAt',
  },
  READY_FOR_DISPATCH: {
    from: [incidentStatuses.PLAN_APPROVED],
    to: incidentStatuses.READY_TO_DISPATCH,
    label: 'Ocorrência liberada para despacho',
  },
  DISPATCH: {
    from: [incidentStatuses.READY_TO_DISPATCH],
    to: incidentStatuses.DISPATCHED,
    label: 'Técnico despachado',
    timestamp: 'dispatchedAt',
  },
  START_TRAVEL: {
    from: [incidentStatuses.DISPATCHED],
    to: incidentStatuses.IN_TRANSIT,
    label: 'Técnico iniciou deslocamento',
    timestamp: 'travelStartedAt',
  },
  MARK_ARRIVED: {
    from: [incidentStatuses.IN_TRANSIT],
    to: incidentStatuses.ON_SITE,
    label: 'Técnico chegou ao local',
    timestamp: 'arrivedAt',
  },
  START_DIAGNOSIS: {
    from: [incidentStatuses.ON_SITE],
    to: incidentStatuses.IN_DIAGNOSIS,
    label: 'Diagnóstico iniciado',
    timestamp: 'diagnosisStartedAt',
  },
  START_MAINTENANCE: {
    from: [incidentStatuses.IN_DIAGNOSIS],
    to: incidentStatuses.IN_MAINTENANCE,
    label: 'Manutenção iniciada',
    timestamp: 'maintenanceStartedAt',
  },
  WAIT_RESOURCE: {
    from: [incidentStatuses.IN_DIAGNOSIS, incidentStatuses.IN_MAINTENANCE],
    to: incidentStatuses.AWAITING_RESOURCE,
    label: 'Aguardando recurso',
  },
  RESUME_MAINTENANCE: {
    from: [incidentStatuses.AWAITING_RESOURCE, incidentStatuses.AWAITING_THIRD_PARTY],
    to: incidentStatuses.IN_MAINTENANCE,
    label: 'Manutenção retomada',
  },
  RESOLVE: {
    from: [incidentStatuses.IN_MAINTENANCE],
    to: incidentStatuses.RESOLVED,
    label: 'Ocorrência resolvida',
    timestamp: 'resolvedAt',
  },
  CLOSE: {
    from: [incidentStatuses.RESOLVED],
    to: incidentStatuses.CLOSED,
    label: 'Atendimento encerrado',
    timestamp: 'closedAt',
  },
}

export function normalizeIncidentStatus(status) {
  return legacyStatusMap[status] || status || incidentStatuses.RECEIVED
}
export function getAvailableActions(incident) {
  const status = normalizeIncidentStatus(incident.status)
  return Object.entries(transitions)
    .filter(([, transition]) => transition.from.includes(status))
    .map(([action, transition]) => ({ action, label: transition.label }))
}
export function applyIncidentTransition(
  incident,
  action,
  { user = 'Ana Paula Costa', note = '', technicianId } = {}
) {
  const transition = transitions[action]
  const status = normalizeIncidentStatus(incident.status)
  if (!transition) throw new Error('Ação operacional inválida.')
  if (!transition.from.includes(status))
    throw new Error(`A ação não está disponível para o estado ${statusLabels[status] || status}.`)
  const timestamp = new Date().toISOString()
  const event = {
    id: `TL-${Date.now()}`,
    timestamp,
    user,
    action,
    description: note || transition.label,
    from: status,
    to: transition.to,
  }
  return {
    ...incident,
    status: transition.to,
    assignedTechnicianId: technicianId || incident.assignedTechnicianId,
    timestamps: {
      ...(incident.timestamps || {}),
      [transition.timestamp || 'updatedAt']: timestamp,
    },
    timeline: [...(incident.timeline || []), event],
    updatedAt: timestamp,
    lastTransition: event,
  }
}
