import { history } from '../data/static'
export const useEquipmentHistory = (id) => ({ history: history[id] ?? [], loading: false, error: null })
