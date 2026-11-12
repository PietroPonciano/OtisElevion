import { activity } from '../data/static'
export const useEquipmentActivity = (equipmentId) => ({ activity: activity[equipmentId] ?? null, loading: false, error: null })
