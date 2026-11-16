import { useSyncExternalStore } from 'react'
import { getIncidentsSnapshot, subscribeIncidents } from '../data/incidentStore'
export const useOperationalInbox = () =>
  useSyncExternalStore(subscribeIncidents, getIncidentsSnapshot, getIncidentsSnapshot).inbox
