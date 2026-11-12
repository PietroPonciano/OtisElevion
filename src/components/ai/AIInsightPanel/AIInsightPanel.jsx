import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  Package02Icon,
  Wrench01Icon,
  RefreshIcon,
  WhatsappIcon,
  AlertCircleIcon,
  ClipboardIcon,
} from '@hugeicons/core-free-icons'
import Badge from '../../ui/Badge/Badge'
import Button from '../../ui/Button/Button'
import { insight } from '../../../data/ai'

const confidenceTone = { alta: 'success', media: 'medium', baixa: 'low' }
const confidenceLabel = { alta: 'Confiança alta', media: 'Confiança média', baixa: 'Confiança baixa' }

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('pt-BR')
}

/**
 * Protagonista da tela de detalhes: analisa o histórico do equipamento (problemas
 * anteriores, como foram resolvidos, peças usadas) e aponta o problema mais provável
 * e a peça que o técnico deve levar — antes mesmo de sair para o atendimento.
 */
function AIInsightPanel({ equipmentLabel }) {
  // Texto fixo: nenhuma análise é executada.
  const warning = null
  const analysis = null
  return (
    <section className="ai-insight" aria-label="Insight da IA">
      <header className="ai-insight__header">
        <div className="ai-insight__title">
          <span className="ai-insight__icon">
            <HugeiconsIcon icon={SparklesIcon} size={18} />
          </span>
          <div>
            <h2>Insight da IA</h2>
            <span className="ai-insight__subtitle">
              Análise do histórico de {equipmentLabel || 'equipamento'}
            </span>
          </div>
        </div>
        <Badge tone={'neutral'}>
          Padrões do histórico
        </Badge>
      </header>

      {insight && (
        <div className="ai-insight__body">
          {warning && (
            <p className="ai-insight__warning">
              <HugeiconsIcon icon={AlertCircleIcon} size={14} /> {warning}
            </p>
          )}

          {/* O que importa antes de sair para o atendimento: o diagnóstico e o que
              fazer com ele. Fica no topo, com peso visual maior que o resto. */}
          <div className="ai-insight__diagnosis">
            <span className="ai-insight__label">Problema mais provável</span>
            <p className="ai-insight__cause">{insight.probableCause}</p>
            <Badge tone={confidenceTone[insight.confidence] || 'neutral'}>
              {confidenceLabel[insight.confidence] || 'Confiança não informada'}
            </Badge>
          </div>

          <div className="ai-insight__action-card">
            <span className="ai-insight__label">O que fazer agora</span>
            <div className="ai-insight__action-row">
              <span className="ai-insight__part-icon">
                <HugeiconsIcon icon={insight.suggestedPart ? Package02Icon : Wrench01Icon} size={18} />
              </span>
              <div>
                <strong>Peça sugerida para levar</strong>
                <p>{insight.suggestedPart || 'Nenhuma peça específica identificada no histórico.'}</p>
              </div>
            </div>
            <div className="ai-insight__action-row">
              <span className="ai-insight__part-icon ai-insight__part-icon--neutral">
                <HugeiconsIcon icon={ClipboardIcon} size={18} />
              </span>
              <div>
                <strong>Ação sugerida</strong>
                <p>{insight.suggestedAction}</p>
              </div>
            </div>
          </div>

          {/* Evidência que sustenta o diagnóstico acima: fica disponível, mas fechada
              por padrão, para não competir em destaque com o que a pessoa precisa
              decidir primeiro. */}
          <details className="ai-insight__evidence">
            <summary>
              <span>Baseado no histórico do equipamento</span>
              <small>Ver evidências</small>
            </summary>
            <div className="ai-insight__evidence-content">
              {insight.patternsFound?.length > 0 && (
                <div className="ai-insight__block">
                  <span className="ai-insight__label">Padrões encontrados</span>
                  <ul className="ai-insight__list">
                    {insight.patternsFound.map((pattern) => (
                      <li key={pattern}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="ai-insight__block">
                <span className="ai-insight__label">Como problemas semelhantes foram resolvidos</span>
                <p>{insight.pastResolutionSummary}</p>
              </div>
              {analysis?.lastOccurrence && (
                <p className="ai-insight__meta">
                  Baseado em {analysis.totalIncidents} ocorrência(s) anteriores deste equipamento ·
                  última em {formatDate(analysis.lastOccurrence)}
                </p>
              )}
            </div>
          </details>

          <p className="ai-insight__disclaimer">
            Gerado a partir do histórico do equipamento e das informações desta ocorrência. Revise
            antes de decidir — a IA não substitui o diagnóstico em campo.
          </p>

          <div className="ai-insight__actions">
            <Button variant="ghost">
              <HugeiconsIcon icon={RefreshIcon} size={15} /> Gerar novamente
            </Button>
            <Button>
              <HugeiconsIcon icon={WhatsappIcon} size={15} /> Enviar por WhatsApp
            </Button>
          </div>
        </div>
      )}

    </section>
  )
}
export default AIInsightPanel
