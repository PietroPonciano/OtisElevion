import { useIncidents } from './useIncidents'
export function useIncident(id) {
  const { incidents, ...rest } = useIncidents()
  return { incident: incidents.find((item) => item.id === id), ...rest }
}
