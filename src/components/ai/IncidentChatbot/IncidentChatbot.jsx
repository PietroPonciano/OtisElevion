import { Fragment, useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiChat02Icon,
  ArrowRight02Icon,
  SparklesIcon,
  CheckmarkCircle02Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { chatMessages, insight, traceSteps } from '../../../data/ai'
import './IncidentChatBot.css'

const confidenceLabel = { alta: 'Confiança alta', media: 'Confiança média', baixa: 'Confiança baixa' }
const stageLabels = ['Local', 'Equipamento', 'Pessoas', 'Relato', 'Sintomas', 'Previsão']
const traceItems = traceSteps.map(([label, detail], index) => ({ id: index, label, detail, status: 'done' }))
// A mensagem de raciocínio aparece logo antes da conclusão da IA.
const traceAfter = chatMessages.length - 1

const ui = {
  caret: {
    display: 'inline-block',
    width: 7,
    height: '1em',
    marginLeft: 2,
    verticalAlign: '-0.15em',
    background: 'var(--sinal)',
    borderRadius: 1,
  },
  thinking: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    padding: '4px 2px',
  },
  thinkingBars: { display: 'flex', alignItems: 'flex-end', gap: 2, height: 13 },
  thinkingBar: {
    display: 'block',
    width: 3,
    height: '100%',
    background: 'var(--sinal)',
    borderRadius: 2,
    transformOrigin: 'bottom',
  },
  thinkingText: {
    fontFamily: 'var(--mono)',
    fontSize: '0.78rem',
    color: 'transparent',
    backgroundImage: 'linear-gradient(90deg, var(--suave) 0%, var(--texto) 45%, var(--suave) 90%)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  },
  trace: {
    alignSelf: 'stretch',
    background: 'var(--fundo-trace)',
    border: '1px solid var(--linha)',
    borderLeft: '2px solid var(--linha)',
    borderRadius: 12,
  },
  traceHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 14px',
    font: 'inherit',
    color: 'var(--texto)',
    textAlign: 'left',
    cursor: 'pointer',
    background: 'none',
    border: 0,
    borderRadius: 'inherit',
  },
  icon: { display: 'grid', flex: 'none', placeItems: 'center', width: 16, height: 16, color: 'var(--sinal)' },
  spinner: {
    display: 'block',
    width: 12,
    height: 12,
    border: '2px solid rgba(111, 224, 255, 0.25)',
    borderTopColor: 'var(--sinal)',
    borderRadius: '50%',
  },
  title: { flex: 1, fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600 },
  count: { fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--suave)' },
  chevron: { display: 'grid', color: 'var(--suave)' },
  list: { display: 'flex', flexDirection: 'column', gap: 12, padding: '2px 14px 14px', margin: 0, listStyle: 'none' },
  step: { display: 'flex', gap: 10 },
  label: { margin: 0, fontSize: '0.86rem', fontWeight: 600, lineHeight: 1.35 },
  detail: {
    margin: '3px 0 0',
    fontFamily: 'var(--mono)',
    fontSize: '0.76rem',
    lineHeight: 1.5,
    color: 'var(--suave)',
    overflowWrap: 'anywhere',
  },
}

/** Bloco de raciocínio: cada etapa entra na hora, com spinner → check, como um log de agente. */
function ReasoningTrace({ steps, open, running, onToggle }) {
  return (
    <div
      className={`ai-trace${running ? ' is-running' : ''}`}
      style={{ ...ui.trace, borderLeftColor: running ? 'var(--sinal)' : 'var(--linha)' }}
    >
      <button type="button" className="ai-trace__head" style={ui.traceHead} onClick={onToggle} aria-expanded={open}>
        <span style={ui.icon}>
          {running ? (
            <span className="ai-trace__spinner" style={ui.spinner} />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
          )}
        </span>
        <span style={ui.title}>{running ? 'Raciocinando…' : 'Raciocínio concluído'}</span>
        <span style={ui.count}>
          {steps.length} {steps.length === 1 ? 'etapa' : 'etapas'}
        </span>
        <span
          className="ai-trace__chevron"
          style={{ ...ui.chevron, transform: open ? 'rotate(90deg)' : 'none' }}
          aria-hidden="true"
        >
          <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
        </span>
      </button>

      {open && (
        <ol style={ui.list}>
          {steps.map((step) => {
            const isRunning = step.status === 'running'
            return (
              <li key={step.id} className="ai-trace__step" style={ui.step}>
                <span style={{ ...ui.icon, marginTop: 2, color: isRunning ? 'var(--sinal)' : 'var(--suave)' }}>
                  {isRunning ? (
                    <span className="ai-trace__spinner" style={ui.spinner} />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                  )}
                </span>
                <div>
                  <p style={{ ...ui.label, color: isRunning ? 'var(--sinal)' : 'var(--texto)' }}>{step.label}</p>
                  <p style={ui.detail}>
                    {step.detail}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

/** Conversa de exemplo com a IA, já concluída e com texto fixo. */
function IncidentChatbot() {
  const [traceOpen, setTraceOpen] = useState(false)
  const threadRef = useRef(null)

  // Como no fluxo real, a conversa termina rolada até a previsão.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [])

  return (
    <section className="ai-chat" aria-label="Assistente de IA para nova ocorrência">
      <header className="ai-chat__header">
        <span className="ai-chat__orb" aria-hidden="true">
          <HugeiconsIcon icon={AiChat02Icon} size={17} />
        </span>
        <div className="ai-chat__heading">
          <h2>Assistente de IA</h2>
          <p className="ai-chat__status" aria-live="polite">
            <span className="ai-chat__pulse" aria-hidden="true" />
            Previsão pronta
          </p>
        </div>
        <div
          className="ai-chat__progress"
          role="progressbar"
          aria-label="Progresso do registro"
          aria-valuemin={0}
          aria-valuemax={6}
          aria-valuenow={6}
        >
          {stageLabels.map((label) => (
            <span key={label} title={label} className="ai-chat__segment is-filled" />
          ))}
        </div>
      </header>

      <div className="ai-chat__thread" ref={threadRef}>
        {chatMessages.map(([from, text], index) => (
          <Fragment key={text}>
            {index === traceAfter && (
              <ReasoningTrace
                steps={traceItems}
                open={traceOpen}
                running={false}
                onToggle={() => setTraceOpen((current) => !current)}
              />
            )}
            <div className={`ai-chat__bubble ai-chat__bubble--${from}`}>{text}</div>
          </Fragment>
        ))}

        <div className="ai-chat__result">
          <div className="ai-chat__result-head" style={{ '--i': 0 }}>
            <HugeiconsIcon icon={SparklesIcon} size={15} />
            <strong>Previsão da IA</strong>
            <span className="ai-chat__tag">Histórico</span>
          </div>

          <div className="ai-chat__main" style={{ '--i': 1 }}>
            <p className="ai-chat__result-label">Problema mais provável</p>
            <h3 className="ai-chat__cause">{insight.probableCause}</h3>
            <div className="ai-chat__meter" style={{ '--pct': '92%' }}>
              <div className="ai-chat__meter-bar">
                <div className="ai-chat__meter-fill" />
              </div>
              <span>{confidenceLabel[insight.confidence]}</span>
            </div>
          </div>

          <div className="ai-chat__todo" style={{ '--i': 2 }}>
            <div className="ai-chat__todo-item">
              <span className="ai-chat__result-label">Levar</span>
              <strong>{insight.suggestedPart}</strong>
            </div>
            <div className="ai-chat__todo-item">
              <span className="ai-chat__result-label">Ação</span>
              <p>{insight.suggestedAction}</p>
            </div>
          </div>

          <details className="ai-chat__more" style={{ '--i': 3 }}>
            <summary>Ver detalhes</summary>
            <ul className="ai-chat__history">
              <li>{insight.pastResolutionSummary}</li>
            </ul>
          </details>
        </div>
      </div>

      <div className="ai-chat__composer">
        <div className="ai-chat__chips">
          <button type="button" className="ai-chat__confirm">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} /> Usar estas informações
          </button>
          <button type="button">
            <HugeiconsIcon icon={RefreshIcon} size={14} /> Recomeçar
          </button>
        </div>
      </div>
    </section>
  )
}
export default IncidentChatbot
