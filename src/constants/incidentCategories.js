export const incidentCategoryLabels = {
  entrapment: 'Pessoa presa',
  door: 'Falha de porta',
  leveling: 'Nivelamento irregular',
  stopped: 'Elevador parado',
  intermittent: 'Falha intermitente',
  controller: 'Falha de controlador',
  unclassified: 'Em análise',
}

export const incidentCategoryOptions = Object.entries(incidentCategoryLabels).map(
  ([value, label]) => ({ value, label })
)

export function categoryLabel(category) {
  return incidentCategoryLabels[category] || 'Categoria não classificada'
}
