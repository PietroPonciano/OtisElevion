import { useSyncExternalStore } from 'react'
import { getIncidentsSnapshot, subscribeIncidents } from '../data/incidentStore'
const noop = () => undefined
// Telas estáticas: as ações existem, mas não alteram nenhum dado do snapshot.
// A lista inclui os chamados criados pela IA (ver data/incidentStore.js).
const actions = {
  loading: false,
  error: null,
  refresh: noop,
  createIncident: noop,
  updateIncident: noop,
  updateStatus: noop,
  performAction: noop,
  saveRecommendedPlan: noop,
  approvePlan: noop,
  reassignTechnician: noop,
  overrideClassification: noop,
  resolveIncident: noop,
}
// Mantém o mesmo objeto enquanto a lista não muda, para não gerar renderizações extras.
let cachedSource = null
let cachedValue = null
const getValue = () => {
  const source = getIncidentsSnapshot()
  if (source !== cachedSource) {
    cachedSource = source
    cachedValue = { incidents: source.incidents, ...actions }
  }
  return cachedValue
}
export const useIncidents = () => useSyncExternalStore(subscribeIncidents, getValue, getValue)
