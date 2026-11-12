export const equipmentCategoryLabels = {
  elevator: 'Elevador',
  escalator: 'Escada Rolante',
}
export function equipmentCategoryLabel(category) {
  return equipmentCategoryLabels[category] || 'Não classificado'
}
export const equipmentCategoryOptions = Object.entries(equipmentCategoryLabels).map(
  ([value, label]) => ({ value, label })
)
