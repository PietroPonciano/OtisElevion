import { useEffect, useState } from 'react'
import { getSlaStatus } from '../../../utils/sla'
function SlaIndicator({ incident, detailed = false }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 60000)
    return () => window.clearInterval(timer)
  }, [])
  const sla = getSlaStatus(incident)
  return (
    <div className={`sla-indicator sla-indicator--${sla.state}`}>
      <div>
        <strong>{detailed ? 'SLA operacional' : sla.label}</strong>
        <span>Dado demonstrativo</span>
      </div>
      <b>{sla.state === 'breached' ? `${sla.formatted} excedido` : `${sla.formatted} restantes`}</b>
    </div>
  )
}
export default SlaIndicator
