import Badge from '../../ui/Badge/Badge'
function DecisionLayers({ decision }) {
  return (
    <section className="decision-layers">
      <header>
        <p className="eyebrow">Motor supervisionado</p>
        <h2>Como a recomendação foi formada</h2>
      </header>
      <div>
        <strong>Dados informados</strong>
        <p>
          Canal, descrição, local e equipamento são exibidos conforme recebidos. Campos ausentes
          permanecem como não informados.
        </p>
      </div>
      <div>
        <strong>Inferências do sistema</strong>
        <p>
          Classificação, prioridade, risco e recorrência são calculados por regras determinísticas
          a partir dos dados conhecidos, inferidos e faltantes desta ocorrência.
        </p>
        <Badge tone="neutral">
          Confiança da classificação:{' '}
          {decision.classification.confidence.score !== null
            ? `${decision.classification.confidence.level} (${Math.round(decision.classification.confidence.score * 100)}%)`
            : decision.classification.confidence.level}
        </Badge>
      </div>
      <div>
        <strong>Recomendações</strong>
        <p>Plano, recursos, ETA e ranking de técnicos exigem revisão e aprovação humana.</p>
      </div>
    </section>
  )
}
export default DecisionLayers
