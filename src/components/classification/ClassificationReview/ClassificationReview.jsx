import { useState } from 'react'
import Button from '../../ui/Button/Button'
import Badge from '../../ui/Badge/Badge'
import Select from '../../ui/Select/Select'
import { incidentCategoryOptions, categoryLabel } from '../../../constants/incidentCategories'

const severityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]
const severityTone = { critical: 'critical', high: 'high', medium: 'neutral', low: 'neutral' }
const severityText = { critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa' }

function ClassificationReview({ decision, onConfirm, onEdit, onRequestInformation, processing }) {
  const [editing, setEditing] = useState(false)
  const [category, setCategory] = useState(decision.classification.category)
  const [severity, setSeverity] = useState(decision.classification.severity)
  const isOverride = decision.classification.confidence.score === null
  const confidence = decision.classification.confidence

  const save = () => {
    onEdit({ category, type: categoryLabel(category), severity })
    setEditing(false)
  }

  if (editing)
    return (
      <section className="classification-review">
        <header>
          <div>
            <p className="eyebrow">Corrigir classificação</p>
            <h2>Ajuste manual</h2>
          </div>
        </header>
        <div className="form-grid">
          <Select
            label="Categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={incidentCategoryOptions}
          />
          <Select
            label="Severidade"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            options={severityOptions}
          />
        </div>
        <p className="classification-review__note">
          A correção fica registrada como intervenção humana e passa a valer para a decisão desta
          ocorrência.
        </p>
        <div className="stack-actions">
          <Button onClick={save}>Salvar correção</Button>
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </div>
      </section>
    )

  return (
    <section className="classification-review">
      <header>
        <div>
          <p className="eyebrow">Classificação sugerida</p>
          <h2>{decision.classification.type}</h2>
        </div>
        <Badge tone={severityTone[decision.classification.severity] || 'neutral'}>
          {severityText[decision.classification.severity] || decision.classification.severity}
        </Badge>
      </header>
      <dl>
        <div>
          <dt>Categoria</dt>
          <dd>{categoryLabel(decision.classification.category)}</dd>
        </div>
        <div>
          <dt>Confiança</dt>
          <dd>
            {isOverride ? confidence.level : `${confidence.level} (${Math.round(confidence.score * 100)}%)`}
          </dd>
        </div>
        <div>
          <dt>Motivo</dt>
          <dd>{decision.classification.reasons.join('; ')}</dd>
        </div>
      </dl>
      <p className="classification-review__note">
        A sugestão é baseada nos dados informados e pode ser corrigida pelo supervisor.
      </p>
      <div className="stack-actions">
        <Button disabled={processing} onClick={onConfirm}>
          Confirmar classificação
        </Button>
        <Button disabled={processing} variant="secondary" onClick={() => setEditing(true)}>
          Editar
        </Button>
        <Button disabled={processing} variant="ghost" onClick={onRequestInformation}>
          Solicitar informações
        </Button>
      </div>
    </section>
  )
}

export default ClassificationReview
