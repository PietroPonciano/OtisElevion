import { decisions } from '../data/static'
export const useIncidentDecision = (incident) => (incident ? (decisions[incident.id] ?? null) : null)
