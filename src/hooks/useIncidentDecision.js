import { useSyncExternalStore } from 'react'
import { getIncidentsSnapshot, subscribeIncidents } from '../data/incidentStore'
export const useIncidentDecision = (incident) => {
  const { decisions } = useSyncExternalStore(subscribeIncidents, getIncidentsSnapshot, getIncidentsSnapshot)
  return incident ? (decisions[incident.id] ?? null) : null
}
