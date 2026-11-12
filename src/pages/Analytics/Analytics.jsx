import { useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useAnalyticsReport } from '../../hooks/useAnalyticsReport'

// Cor sempre pela prioridade, não pela ordem em que ela aparece no array — assim
// "crítico" é sempre vermelho, independente de quantas ocorrências críticas existam
// ou da ordem de Object.entries no momento do cálculo.
const priorityColors = {
  critical: 'var(--color-critical)',
  high: 'var(--color-warning)',
  medium: 'var(--color-blue)',
  low: 'var(--color-muted)',
}
const periodOptions = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
]

function TrendBadge({ value }) {
  if (value === null || value === undefined) return null
  const isUp = value > 0
  const isFlat = value === 0
  return (
    <Badge tone={isFlat ? 'neutral' : isUp ? 'high' : 'success'}>
      {isFlat ? 'estável' : `${isUp ? '▲' : '▼'} ${Math.abs(value)}%`}
    </Badge>
  )
}

function Analytics() {
  const [periodDays, setPeriodDays] = useState(30)
  const { report } = useAnalyticsReport(periodDays)

  if (!report)
    return (
      <PageContainer title="Indicadores" description="Não foi possível calcular os indicadores.">
        <EmptyState title="Sem dados disponíveis" />
      </PageContainer>
    )

  const { totals, priorityBreakdown, areaBreakdown, equipmentBreakdown, technicianBreakdown, dailySeries } =
    report
  const maxAreaTotal = Math.max(1, ...areaBreakdown.map((item) => item.total))

  return (
    <PageContainer
      title="Indicadores"
      description={`Leitura operacional dos últimos ${periodDays} dias, comparada ao período anterior de mesma duração.`}
      actions={
        <div className="period-switch">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === periodDays ? 'active' : ''}
              aria-pressed={option.value === periodDays}
              onClick={() => setPeriodDays(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      <section className="metric-grid">
        <article className="metric-card">
          <span>Volume de ocorrências</span>
          <strong>{totals.volume}</strong>
          <TrendBadge value={totals.volumeTrend} />
        </article>
        <article className="metric-card">
          <span>Em aberto agora</span>
          <strong>{totals.open}</strong>
          <small>{totals.critical} crítica(s) entre elas</small>
        </article>
        <article className="metric-card">
          <span>Cumprimento de SLA</span>
          <strong>
            {totals.slaCompliance === null ? '—' : `${totals.slaCompliance}%`}
          </strong>
          <small>
            {totals.slaBreached
              ? `${totals.slaBreached} ocorrência(s) estouraram o prazo`
              : 'Nenhuma ocorrência estourou o prazo no período'}
          </small>
        </article>
        <article className="metric-card">
          <span>First Time Fix</span>
          <strong>{totals.firstTimeFix === null ? '—' : `${totals.firstTimeFix}%`}</strong>
          <small>Resolvido em uma única visita</small>
        </article>
      </section>

      <div className="analytics-grid">
        <Card title="Ocorrências por prioridade">
          {priorityBreakdown.every((item) => item.total === 0) ? (
            <EmptyState title="Sem ocorrências no período" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={priorityBreakdown} dataKey="total" nameKey="label" outerRadius={82} label>
                  {priorityBreakdown.map((entry) => (
                    <Cell key={entry.key} fill={priorityColors[entry.key]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Volume ao longo do período">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={Math.ceil(dailySeries.length / 6)} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="var(--color-blue)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Ocorrências por área" className="analytics-wide">
          {areaBreakdown.length === 0 ? (
            <EmptyState title="Sem ocorrências no período" />
          ) : (
            <div className="area-bars">
              {areaBreakdown.map((area) => (
                <div key={area.id || area.name} className="area-bar-row">
                  <span>{area.name}</span>
                  <div className="area-bar-track">
                    <div
                      className="area-bar-fill"
                      style={{ width: `${(area.total / maxAreaTotal) * 100}%` }}
                    />
                  </div>
                  <b>{area.total}</b>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Equipamentos com mais chamados">
          {equipmentBreakdown.length === 0 ? (
            <EmptyState title="Sem ocorrências no período" />
          ) : (
            <div className="recurrence-list">
              {equipmentBreakdown.map((item, index) => (
                <div key={item.equipmentId}>
                  <strong>{item.equipmentId}</strong>
                  <span>{item.total} ocorrência(s) no período</span>
                  <Badge tone={index === 0 ? 'high' : 'neutral'}>
                    {index === 0 ? 'Atenção' : 'Monitorar'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Técnicos com mais atendimentos">
          {technicianBreakdown.length === 0 ? (
            <EmptyState title="Nenhum técnico atribuído no período" />
          ) : (
            <div className="recurrence-list">
              {technicianBreakdown.slice(0, 5).map((tech) => (
                <div key={tech.id}>
                  <strong>{tech.name}</strong>
                  <span>
                    {tech.total} atendimento(s) · {tech.resolved} resolvido(s)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
export default Analytics
