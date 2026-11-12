import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Card from '../../components/ui/Card/Card'
import Toast from '../../components/ui/Toast/Toast'
import { useIncident } from '../../hooks/useIncident'

const initial = {
  result: 'resolved',
  cause: '',
  diagnosis: '',
  summary: '',
  feedback: '',
  resources: [],
  firstTimeFix: 'yes',
}
const resources = [
  'Kit de diagnóstico',
  'Ferramenta de abertura',
  'Sensor / componente',
  'Ferramentas especiais',
]
function Resolution() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('incident')
  const { incident, resolveIncident } = useIncident(id)
  const [form, setForm] = useState(initial)
  const [score, setScore] = useState('5')
  const [completed, setCompleted] = useState(false)
  if (!incident)
    return (
      <PageContainer
        title="Resolução"
        description="Selecione uma ocorrência para registrar o encerramento."
      />
    )
  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const toggleResource = (resource) =>
    setForm((current) => ({
      ...current,
      resources: current.resources.includes(resource)
        ? current.resources.filter((item) => item !== resource)
        : [...current.resources, resource],
    }))
  const submit = (event) => {
    event.preventDefault()
    resolveIncident(id, { ...form, firstTimeFix: form.firstTimeFix === 'yes' }, score)
    setCompleted(true)
  }
  if (completed)
    return (
      <PageContainer title="Atendimento encerrado" description={`Registro final de ${incident.id}`}>
        <Card title="Histórico atualizado">
          <p>
            O resultado, os recursos e o feedback foram adicionados ao histórico do equipamento.
          </p>
          <p>
            Ocorrências futuras poderão usar esse contexto como dado demonstrativo para novas
            recomendações.
          </p>
          <Button onClick={() => navigate(`/incidents/${id}`)}>Voltar para ocorrência</Button>
        </Card>
        <Toast message="Atendimento encerrado e aprendizado registrado." />
      </PageContainer>
    )
  return (
    <PageContainer title="Encerrar atendimento" description={`Resolução de ${incident.id}`}>
      <form className="incident-form" onSubmit={submit}>
        <section className="form-section">
          <h2>Resultado e diagnóstico</h2>
          <div className="form-grid">
            <Select
              label="Resultado"
              name="result"
              value={form.result}
              onChange={update}
              options={[
                { value: 'resolved', label: 'Resolvido' },
                { value: 'temporary', label: 'Resolvido temporariamente' },
                { value: 'unresolved', label: 'Não resolvido' },
                { value: 'needs_return', label: 'Necessita retorno' },
              ]}
            />
            <Select
              label="Solução no primeiro atendimento"
              name="firstTimeFix"
              value={form.firstTimeFix}
              onChange={update}
              options={[
                { value: 'yes', label: 'Sim' },
                { value: 'no', label: 'Não' },
              ]}
            />
            <Input
              label="Causa identificada"
              name="cause"
              value={form.cause}
              onChange={update}
              required
            />
            <Input
              label="Diagnóstico"
              name="diagnosis"
              value={form.diagnosis}
              onChange={update}
              required
            />
            <label className="ui-field full">
              <span>Resumo do serviço executado</span>
              <textarea
                className="ui-input"
                rows="4"
                name="summary"
                value={form.summary}
                onChange={update}
                required
              />
            </label>
          </div>
        </section>
        <section className="form-section">
          <h2>Recursos utilizados</h2>
          <div className="resource-checklist">
            {resources.map((resource) => (
              <label key={resource}>
                <input
                  type="checkbox"
                  checked={form.resources.includes(resource)}
                  onChange={() => toggleResource(resource)}
                />
                {resource}
              </label>
            ))}
          </div>
        </section>
        <section className="form-section">
          <h2>Feedback operacional</h2>
          <div className="form-grid">
            <Input
              label="Satisfação do solicitante (1 a 5)"
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(event) => setScore(event.target.value)}
            />
            <label className="ui-field full">
              <span>Feedback técnico</span>
              <textarea
                className="ui-input"
                rows="3"
                name="feedback"
                value={form.feedback}
                onChange={update}
                placeholder="Descreva o que foi encontrado e o que deve ser observado no próximo atendimento."
              />
            </label>
          </div>
        </section>
        <div className="form-actions">
          <Button variant="ghost" onClick={() => navigate(`/incidents/${id}`)}>
            Cancelar
          </Button>
          <Button type="submit">Encerrar atendimento</Button>
        </div>
      </form>
    </PageContainer>
  )
}
export default Resolution
