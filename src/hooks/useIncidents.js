import { incidents } from '../data/static'
const noop = () => undefined
// Telas estáticas: as ações existem, mas não alteram nenhum dado.
const value = {
  incidents,
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
export const useIncidents = () => value
