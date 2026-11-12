export const equipmentStatusLabels = {
  operational: 'Operacional',
  maintenance: 'Em manutenção',
  out_of_service: 'Fora de serviço',
}

export function equipmentStatusLabel(status) {
  return equipmentStatusLabels[status] || 'Status não informado'
}
