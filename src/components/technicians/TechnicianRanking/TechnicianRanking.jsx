import { useState } from 'react'
import Button from '../../ui/Button/Button'
import Progress from '../../ui/Progress/Progress'
import Badge from '../../ui/Badge/Badge'
import Modal from '../../ui/Modal/Modal'

// Converte os pontos reais do motor de ranking (engine/technicianRanking.js) em uma
// porcentagem visual, sem recalcular nem inventar nenhum novo critério.
function factorPercentage(factor) {
  if (factor.max > 0) return Math.round((Math.max(0, factor.points) / factor.max) * 100)
  return factor.matched ? 100 : 40
}

function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function FactorBreakdown({ factors }) {
  return (
    <div className="fit-details">
      <p>Critérios usados no cálculo real desta recomendação.</p>
      {factors.map((factor) => (
        <div key={factor.key}>
          <span>{factor.label}</span>
          <Progress value={factorPercentage(factor)} label={`${factor.label}: ${factor.detail}`} />
          <b>{factor.detail}</b>
        </div>
      ))}
    </div>
  )
}

// Mostra a atribuição já congelada no momento da decisão (snapshot). Nunca recalcula
// o motivo a partir do estado atual do técnico — é um registro histórico: o que era
// verdade quando o sistema decidiu pode não ser mais verdade agora, e é justamente
// por isso que precisa ficar salvo, não recalculado a cada visita à tela.
function AssignedTechnician({ assignment, expanded, onToggleExpanded, onOpenReassign }) {
  const isOverride = assignment.method === 'manual_override'
  return (
    <article className="selected assigned-technician">
      <header>
        <div>
          <span>✓</span>
          <div>
            <strong>{assignment.technicianName}</strong>
            <small>Atribuído em {formatDateTime(assignment.decidedAt)}</small>
          </div>
        </div>
        <b>{assignment.score}%</b>
      </header>
      <Badge tone={isOverride ? 'high' : 'success'}>
        {isOverride ? 'Reatribuído manualmente' : 'Atribuição automática'}
      </Badge>
      <p>{assignment.reasons.join(' · ')}</p>
      {isOverride && assignment.reason && (
        <p className="override-reason">
          <strong>Motivo da reatribuição:</strong> {assignment.reason}
        </p>
      )}
      <div className="ranking-actions">
        <button type="button" onClick={onToggleExpanded}>
          {expanded ? 'Ocultar critérios' : 'Por que este técnico?'}
        </button>
        <Button variant="ghost" onClick={onOpenReassign}>
          Trocar técnico
        </Button>
      </div>
      {expanded && <FactorBreakdown factors={assignment.factors} />}
    </article>
  )
}

function TechnicianRanking({ rankings, assignment, onReassign }) {
  const [expanded, setExpanded] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingRanking, setPendingRanking] = useState(null)
  const [reason, setReason] = useState('')

  const openReasonModal = (ranking) => {
    setPendingRanking(ranking)
    setReason('')
    setPickerOpen(false)
  }
  const confirmReassign = () => {
    if (!reason.trim() || !pendingRanking) return
    onReassign(pendingRanking, reason)
    setPendingRanking(null)
    setReason('')
  }

  if (!rankings?.length)
    return <p className="empty-hint">Sem técnicos disponíveis para calcular a recomendação.</p>

  if (!assignment)
    return (
      <p className="empty-hint">
        A atribuição automática acontece assim que o plano de atendimento é gerado. A melhor opção
        neste instante seria <strong>{rankings[0].technician.name}</strong> ({rankings[0].score}%),
        mas esse cálculo ainda não foi congelado.
      </p>
    )

  return (
    <section className="technician-ranking">
      <AssignedTechnician
        assignment={assignment}
        expanded={expanded === 'assigned'}
        onToggleExpanded={() => setExpanded(expanded === 'assigned' ? null : 'assigned')}
        onOpenReassign={() => setPickerOpen(true)}
      />

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Escolher outro técnico">
        <div className="reassign-picker">
          <p>
            A troca é uma exceção à atribuição automática. Escolha uma alternativa e informe o
            motivo, ele fica registrado na auditoria.
          </p>
          {rankings
            .filter((ranking) => ranking.technicianId !== assignment.technicianId)
            .slice(0, 5)
            .map((ranking) => (
              <button
                type="button"
                key={ranking.technicianId}
                className="reassign-option"
                onClick={() => openReasonModal(ranking)}
              >
                <span>{ranking.technician.name}</span>
                <b>{ranking.score}%</b>
              </button>
            ))}
        </div>
      </Modal>

      <Modal
        open={!!pendingRanking}
        onClose={() => setPendingRanking(null)}
        title={`Motivo da reatribuição — ${pendingRanking?.technician.name || ''}`}
      >
        <div className="reassign-reason">
          <p>Por que esse técnico deve atender no lugar da recomendação automática?</p>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Ex.: técnico recomendado já foi acionado para outra emergência crítica."
          />
          <div className="ranking-actions">
            <Button variant="ghost" onClick={() => setPendingRanking(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmReassign} disabled={!reason.trim()}>
              Confirmar troca
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
export default TechnicianRanking
