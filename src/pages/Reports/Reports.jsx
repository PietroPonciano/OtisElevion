import { useState } from 'react'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import Button from '../../components/ui/Button/Button'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useAnalyticsReport } from '../../hooks/useAnalyticsReport'

const periodOptions = [
  { value: 7, label: 'Últimos 7 dias' },
  { value: 30, label: 'Últimos 30 dias' },
  { value: 90, label: 'Últimos 90 dias' },
]

function Reports() {
  const [periodDays, setPeriodDays] = useState(30)
  const { report } = useAnalyticsReport(periodDays)

  if (!report)
    return (
      <PageContainer title="Relatórios" description="Não foi possível gerar o relatório.">
        <EmptyState title="Sem dados disponíveis" />
      </PageContainer>
    )

  const { totals, priorityBreakdown, areaBreakdown, equipmentBreakdown, technicianBreakdown } = report

  return (
    <PageContainer
      title="Relatórios"
      description="Resumo operacional pronto para gestão, com período configurável."
      actions={
        <div className="reports-actions">
          <select value={periodDays} onChange={(event) => setPeriodDays(Number(event.target.value))}>
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={() => window.print()}>
            Exportar / Imprimir
          </Button>
        </div>
      }
    >
      <div className="report-doc">
        <Card title="Resumo do período">
          <div className="report-summary-grid">
            <div>
              <span>Ocorrências no período</span>
              <strong>{totals.volume}</strong>
              {totals.volumeTrend !== null && (
                <Badge tone={totals.volumeTrend > 0 ? 'high' : 'success'}>
                  {totals.volumeTrend > 0 ? '▲' : '▼'} {Math.abs(totals.volumeTrend)}% vs. período anterior
                </Badge>
              )}
            </div>
            <div>
              <span>Em aberto agora</span>
              <strong>{totals.open}</strong>
              <small>{totals.critical} crítica(s) requerem acompanhamento</small>
            </div>
            <div>
              <span>Cumprimento de SLA</span>
              <strong>{totals.slaCompliance === null ? '—' : `${totals.slaCompliance}%`}</strong>
              <small>{totals.slaBreached} ocorrência(s) estouraram o prazo</small>
            </div>
            <div>
              <span>First Time Fix</span>
              <strong>{totals.firstTimeFix === null ? '—' : `${totals.firstTimeFix}%`}</strong>
              <small>Resolvido em uma única visita</small>
            </div>
          </div>
        </Card>

        <Card title="Ocorrências por prioridade">
          <table className="report-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Total</th>
                <th>% do período</th>
              </tr>
            </thead>
            <tbody>
              {priorityBreakdown.map((item) => (
                <tr key={item.key}>
                  <td>
                    <Badge tone={item.key}>{item.label}</Badge>
                  </td>
                  <td>{item.total}</td>
                  <td>{totals.volume ? Math.round((item.total / totals.volume) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Ocorrências por área">
          {areaBreakdown.length === 0 ? (
            <EmptyState title="Sem ocorrências no período" />
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {areaBreakdown.map((area) => (
                  <tr key={area.id || area.name}>
                    <td>{area.name}</td>
                    <td>{area.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Equipamentos com mais chamados">
          {equipmentBreakdown.length === 0 ? (
            <EmptyState title="Sem ocorrências no período" />
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Equipamento</th>
                  <th>Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {equipmentBreakdown.map((item) => (
                  <tr key={item.equipmentId}>
                    <td>{item.equipmentId}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Desempenho por técnico" className="report-wide">
          {technicianBreakdown.length === 0 ? (
            <EmptyState title="Nenhum técnico atribuído no período" />
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Técnico</th>
                  <th>Atendimentos</th>
                  <th>Resolvidos</th>
                  <th>Taxa de conclusão</th>
                </tr>
              </thead>
              <tbody>
                {technicianBreakdown.map((tech) => (
                  <tr key={tech.id}>
                    <td>{tech.name}</td>
                    <td>{tech.total}</td>
                    <td>{tech.resolved}</td>
                    <td>{tech.total ? Math.round((tech.resolved / tech.total) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
export default Reports
