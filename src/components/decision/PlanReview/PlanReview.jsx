import Button from '../../ui/Button/Button'
import Badge from '../../ui/Badge/Badge'
function PlanReview({ plan, technician, eta, onApprove, onRequestInformation }) {
  return (
    <section className="plan-review">
      <header>
        <div>
          <p className="eyebrow">Plano recomendado</p>
          <h2>Revisão humana necessária</h2>
        </div>
        <Badge tone="high">Pendente</Badge>
      </header>
      <p>{plan.disclaimer}</p>
      <div className="plan-review__grid">
        <div>
          <strong>Técnico atribuído automaticamente</strong>
          <span>{technician?.name || 'Nenhum técnico elegível'}</span>
          <small>{technician ? `Adequação no momento da decisão: ${technician.score}%` : ''}</small>
        </div>
        <div>
          <strong>ETA estimado</strong>
          <span>{eta ? `${eta} min` : 'Calculado no plano'}</span>
          <small>Estimativa do protótipo</small>
        </div>
      </div>
      <div className="stack-actions">
        <Button onClick={onApprove} disabled={!technician}>
          Aprovar plano
        </Button>
        <Button variant="ghost" onClick={onRequestInformation}>
          Solicitar mais informações
        </Button>
      </div>
    </section>
  )
}
export default PlanReview
