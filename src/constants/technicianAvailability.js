export const technicianAvailabilityLabels = {
  available: 'Disponível',
  on_service: 'Em atendimento',
}

export function technicianAvailabilityLabel(availability) {
  return technicianAvailabilityLabels[availability] || 'Disponibilidade não informada'
}
