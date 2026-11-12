// Dados fixos da simulação. O arquivo snapshot.json guarda o resultado já calculado
// (fila, SLA, decisões, indicadores, histórico) com a data de referência 26/08/2026 10:30.
import snapshot from './snapshot.json'
import { areas } from './areas'
import { buildings } from './buildings'
import { equipment } from './equipment'
import { technicians } from './technicians'

export const { incidents, decisions, inbox, metrics, reports, activity, history, audit, notifications, previews } =
  snapshot
export { areas, buildings, equipment, technicians }
// Data de referência usada em todos os cálculos de prazo (SLA).
export const REFERENCE_NOW = new Date('2026-08-26T10:30:00').getTime()
