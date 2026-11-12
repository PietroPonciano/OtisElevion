import { REFERENCE_NOW } from '../data/static'
const stateLabels = {
  normal: 'Dentro do SLA',
  attention: 'Atenção ao SLA',
  risk: 'SLA em risco',
  breached: 'SLA estourado',
}
export function getSlaStatus(incident, now = REFERENCE_NOW) {
  const openedAt = new Date(incident.timestamps?.receivedAt || incident.createdAt).getTime()
  const totalMinutes = incident.slaMinutes || 120
  const elapsedMinutes = Math.max(0, Math.floor((now - openedAt) / 60000))
  const remainingMinutes = totalMinutes - elapsedMinutes
  const ratio = remainingMinutes / totalMinutes
  const state =
    remainingMinutes < 0
      ? 'breached'
      : ratio <= 0.2
        ? 'risk'
        : ratio <= 0.4
          ? 'attention'
          : 'normal'
  return {
    totalMinutes,
    elapsedMinutes,
    remainingMinutes,
    state,
    label: stateLabels[state],
    formatted: formatMinutes(remainingMinutes),
    isSimulated: true,
  }
}
export function formatMinutes(minutes) {
  const absolute = Math.abs(minutes)
  const days = Math.floor(absolute / 1440)
  const hours = Math.floor((absolute % 1440) / 60)
  const remainder = absolute % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${remainder}min`
  return `${remainder}min`
}
