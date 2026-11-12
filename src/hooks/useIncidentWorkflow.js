import { useMemo } from 'react'
import { getAvailableActions } from '../engine/incidentWorkflow'
import { statusLabels } from '../constants/incidentStatus'
export function useIncidentWorkflow(incident) {
  return useMemo(
    () => ({
      actions: incident ? getAvailableActions(incident) : [],
      statusLabel: incident ? statusLabels[incident.status] || incident.status : '',
    }),
    [incident]
  )
}
