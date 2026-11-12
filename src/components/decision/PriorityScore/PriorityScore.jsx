import Badge from '../../ui/Badge/Badge'
import { priorityLabel } from '../../../constants/priority'
function PriorityScore({ priority }) {
  return (
    <section className="decision-score">
      <div>
        <span>Prioridade calculada</span>
        <strong>{priority.score}</strong>
        <small>/100</small>
      </div>
      <div>
        <Badge tone={priority.level}>{priorityLabel(priority.level)}</Badge>
        {priority.reasons.map((reason) => (
          <p key={reason}>{reason}</p>
        ))}
      </div>
    </section>
  )
}
export default PriorityScore
