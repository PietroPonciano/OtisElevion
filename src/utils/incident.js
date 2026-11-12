export const informationSources = { REPORTED: 'reported', INFERRED: 'inferred', UNKNOWN: 'unknown' }

export function known(value, source = informationSources.REPORTED) {
  return { value, source, confidence: source === informationSources.INFERRED ? 0.7 : null }
}

export const unknown = () => ({ value: null, source: informationSources.UNKNOWN, confidence: null })

export function getInformationValue(incident, field) {
  const entry = incident.information?.[field]
  return entry ? entry.value : incident[field]
}

export function getInformationEntry(incident, field) {
  return (
    incident.information?.[field] ||
    (incident[field] !== undefined ? known(incident[field]) : unknown())
  )
}

export function toOperationalIncident(incident) {
  const fromLegacy = (field) =>
    incident[field] === undefined || incident[field] === null || incident[field] === ''
      ? unknown()
      : known(incident[field])
  const information = {
    channel: incident.information?.channel || fromLegacy('source'),
    requester: incident.information?.requester || fromLegacy('requester'),
    phone: incident.information?.phone || fromLegacy('phone'),
    buildingId: incident.information?.buildingId || fromLegacy('buildingId'),
    equipmentId: incident.information?.equipmentId || fromLegacy('equipmentId'),
    description: incident.information?.description || fromLegacy('description'),
    passengers: incident.information?.passengers || fromLegacy('passengers'),
    safetyCondition: incident.information?.safetyCondition || fromLegacy('safetyCondition'),
    situationCode: incident.information?.situationCode || fromLegacy('situationCode'),
    observations: incident.information?.observations || fromLegacy('observations'),
  }
  const status = normalizeIncidentStatus(incident.status)
  const initialTimestamp = incident.createdAt || new Date().toISOString()
  return {
    ...incident,
    status,
    passengers: information.passengers.value,
    safetyCondition: information.safetyCondition.value,
    information,
    intake: incident.intake || {
      channel: information.channel.value || 'Outro canal',
      receivedAt: incident.createdAt,
      originalMessage: information.description.value || null,
    },
    classification: incident.classification || null,
    priorityDecision: incident.priorityDecision || null,
    risk: incident.risk || { value: null, source: informationSources.UNKNOWN, confidence: null },
    plan: incident.plan || null,
    approvals: incident.approvals || { planApprovedAt: null, approvedBy: null },
    timestamps: { receivedAt: initialTimestamp, ...(incident.timestamps || {}) },
    timeline: incident.timeline?.length
      ? incident.timeline
      : [
          {
            id: `TL-SEED-${incident.id}`,
            timestamp: initialTimestamp,
            user: 'Central OTIS',
            action: 'RECEIVED',
            description: 'Ocorrência recebida',
            from: null,
            to: status,
          },
        ],
    diagnosis: incident.diagnosis || null,
    resolutionDetails: incident.resolutionDetails || null,
    resourcesUsed: incident.resourcesUsed || [],
  }
}
import { normalizeIncidentStatus } from '../engine/incidentWorkflow'
