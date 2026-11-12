import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Button from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card/Card'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import Badge from '../../components/ui/Badge/Badge'
import Tabs from '../../components/ui/Tabs/Tabs'
import PriorityScore from '../../components/decision/PriorityScore/PriorityScore'
import SlaIndicator from '../../components/incidents/SlaIndicator/SlaIndicator'
import { useIncident } from '../../hooks/useIncident'
import { useIncidentDecision } from '../../hooks/useIncidentDecision'
import { useBuildings } from '../../hooks/useBuildings'
import { useEquipment } from '../../hooks/useEquipment'
import { useIncidentWorkflow } from '../../hooks/useIncidentWorkflow'
import IncidentCompleteness from '../../components/incidents/IncidentCompleteness/IncidentCompleteness'
import ClassificationReview from '../../components/classification/ClassificationReview/ClassificationReview'
import DecisionLayers from '../../components/decision/DecisionLayers/DecisionLayers'
import PlanReview from '../../components/decision/PlanReview/PlanReview'
import TechnicianRanking from '../../components/technicians/TechnicianRanking/TechnicianRanking'
import IncidentTimeline from '../../components/incidents/IncidentTimeline/IncidentTimeline'
import AIInsightPanel from '../../components/ai/AIInsightPanel/AIInsightPanel'
import { priorityLabel } from '../../constants/priority'
import './IncidentDetails.css'

const detailTabs = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'decision', label: 'Decisão e plano' },
  { id: 'history', label: 'Histórico' },
]
function IncidentDetails() {
  const { id } = useParams()
  const { incident, performAction, saveRecommendedPlan, approvePlan, reassignTechnician, overrideClassification } =
    useIncident(id)
  const [activeTab, setActiveTab] = useState('overview')
  const [recalcNotice] = useState(null)
  const decision = useIncidentDecision(incident)
  const workflow = useIncidentWorkflow(incident)
  const { buildings } = useBuildings()
  const { equipment } = useEquipment()
  if (!incident)
    return (
      <PageContainer title="Ocorrência">
        <EmptyState
          title="Ocorrência não encontrada"
          action={
            <Link className="primary-action" to="/incidents">
              Voltar para ocorrências
            </Link>
          }
        />
      </PageContainer>
    )
  const building = buildings.find((item) => item.id === incident.buildingId)
  const device = equipment.find((item) => item.id === incident.equipmentId)
  // A atribuição exibida é sempre o snapshot congelado no momento da decisão
  // (incident.assignmentSnapshot), nunca o recálculo ao vivo do ranking — assim o
  // motivo mostrado continua sendo o motivo que valia quando o sistema decidiu.
  const assignment = incident.assignmentSnapshot
  const isClassifying = incident.status === 'AWAITING_CLASSIFICATION'
  const isPlanPending = incident.status === 'PLAN_PENDING'
  const etaLabel = decision.eta.minutes ? `${decision.eta.minutes} min` : 'Aguardando técnico'
  const handleReassign = (ranking, reason) => {
    reassignTechnician(incident.id, ranking, reason, 'Ana Paula Costa')
  }
  const runAction = (action) => {
    if (action === 'CREATE_PLAN') {
      saveRecommendedPlan(incident.id, decision.plan, decision)
      return performAction(incident.id, action)
    }
    return performAction(incident.id, action)
  }
  // A prioridade e o plano dependem da classificação e são sempre recomputados ao
  // vivo (decision.priority/decision.plan nunca ficam presos ao valor antigo). O que
  // faltava era deixar isso visível para o operador logo após a correção manual.
  // Tela estática: a correção manual da classificação não altera nada.
  const editClassification = () => undefined
  const actions = workflow.actions.filter(
    ({ action }) =>
      (!isClassifying || !['COMPLETE_CLASSIFICATION', 'REQUEST_INFORMATION'].includes(action)) &&
      (!isPlanPending || !['APPROVE_PLAN', 'REQUEST_INFORMATION'].includes(action))
  )
  return (
    <PageContainer
      title={incident.id}
      description={incident.description}
      actions={<Badge tone={incident.priority}>{priorityLabel(incident.priority)}</Badge>}
    >
      {/* Faixa de contexto: SLA + resumo da ocorrência, sempre visível no topo */}
      <section className="ui-card incident-context" aria-label="Contexto da ocorrência">
        <div className="incident-context__sla">
          <SlaIndicator incident={incident} />
        </div>
        <dl className="incident-context__facts">
          <div>
            <dt>Local</dt>
            <dd>{building?.name || 'Não informado'}</dd>
          </div>
          <div>
            <dt>Equipamento</dt>
            <dd>{device?.id || 'Não informado'}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{workflow.statusLabel}</dd>
          </div>
          <div>
            <dt>ETA</dt>
            <dd>{etaLabel}</dd>
          </div>
        </dl>
      </section>

      <div className="detail-grid">
        <main className="detail-main">
          {/* 1. Decisão principal primeiro */}
          {isClassifying && (
            <>
              {recalcNotice && (
                <div className="recalc-banner">
                  <p>
                    ⚙️ Classificação corrigida — prioridade e plano recalculados.
                  </p>
                  <p>
                    <strong>Nova prioridade:</strong> {priorityLabel(recalcNotice.priority.level)} ·{' '}
                    <strong>Plano:</strong> {recalcNotice.stepCount} passo(s),{' '}
                    {recalcNotice.resources.join(', ') || 'nenhum recurso específico'}
                  </p>
                  <button type="button" onClick={() => setRecalcNotice(null)}>
                    Ok, entendi
                  </button>
                </div>
              )}
              {/* <ClassificationReview
                decision={decision}
                onConfirm={() => runAction('COMPLETE_CLASSIFICATION')}
                onEdit={editClassification}
                onRequestInformation={() => runAction('REQUEST_INFORMATION')}
              /> */}
            </>
          )}
          {isPlanPending && (
            <PlanReview
              plan={incident.plan || decision.plan}
              technician={assignment && { name: assignment.technicianName, score: assignment.score }}
              eta={decision.eta.minutes}
              onApprove={() => approvePlan(incident.id, incident.plan || decision.plan)}
              onRequestInformation={() => runAction('REQUEST_INFORMATION')}
            />
          )}

          {/* 2. Detalhamento em abas */}
          <Tabs tabs={detailTabs} activeId={activeTab} onChange={setActiveTab} />
          {activeTab === 'overview' && (
            <>
              <Card title="Decisão operacional">
                <div className="decision-summary">
                  <div className="decision-summary__priority">
                    <PriorityScore priority={decision.priority} />
                  </div>
                  <div className="decision-summary__info info-list">
                    <p>
                      <strong>Classificação:</strong> {decision.classification.type}
                    </p>
                    <p>
                      <strong>Recorrência:</strong> {decision.recurrence.reason}
                    </p>
                  </div>
                </div>
              </Card>
              <details className="ui-card disclosure-card">
                <summary>
                  <span>Completude da ocorrência</span>
                  <small>Ver informações disponíveis</small>
                </summary>
                <div className="disclosure-card__content">
                  <IncidentCompleteness incident={incident} />
                </div>
              </details>
            </>
          )}
          {activeTab === 'decision' && (
            <>
              <Card title="Como o sistema chegou a esta recomendação">
                <DecisionLayers decision={decision} />
              </Card>
              <Card title="Plano de atendimento">
                <ol className="plan-list">
                  {(incident.plan?.steps || decision.plan.steps).map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="resource-list">
                  <strong>Recursos sugeridos:</strong>{' '}
                  {(incident.plan?.resources || decision.plan.resources).join(', ') ||
                    'Nenhum recurso específico'}
                </p>
              </Card>
            </>
          )}
          {activeTab === 'history' && (
            <Card title="Timeline operacional">
              <IncidentTimeline events={incident.timeline} />
            </Card>
          )}

          {/* 3. Quem atende e o que fazer em seguida: ficam junto da decisão, na coluna principal */}
          <details className="ui-card disclosure-card">
            <summary>
              <span>Técnicos recomendados</span>
              <small>Ver opções</small>
            </summary>
            <div className="disclosure-card__content">
              <TechnicianRanking
                rankings={decision.technicianRanking}
                assignment={assignment}
                onReassign={handleReassign}
              />
            </div>
          </details>
          {!!actions.length && (
            <Card title="Próxima ação">
              <div className="stack-actions">
                {actions.map(({ action, label }) =>
                  action === 'RESOLVE' ? (
                    <Link
                      key={action}
                      className="ui-button ui-button--primary"
                      to={`/resolution?incident=${incident.id}`}
                    >
                      Registrar resolução
                    </Link>
                  ) : (
                    <Button key={action} onClick={() => runAction(action)}>
                      {label}
                    </Button>
                  )
                )}
              </div>
            </Card>
          )}
        </main>
        <aside className="detail-side">
          <AIInsightPanel
            incident={incident}
            assignment={assignment}
            technicianRanking={decision.technicianRanking}
            building={building}
            equipmentLabel={device ? `${device.code} · ${device.model}` : incident.equipmentId}
          />
        </aside>
      </div>
    </PageContainer>
  )
}
export default IncidentDetails