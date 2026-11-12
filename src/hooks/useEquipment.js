import { equipment } from '../data/static'
export const useEquipment = (id) => ({
  equipment: id ? equipment.find((item) => item.id === id) : equipment,
  loading: false,
  error: null,
})
