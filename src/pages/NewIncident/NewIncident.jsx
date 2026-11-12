import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import { useBuildings } from '../../hooks/useBuildings'
import { useEquipment } from '../../hooks/useEquipment'
import { previews } from '../../data/static'
import IncidentChatbot from '../../components/ai/IncidentChatbot/IncidentChatbot'

const whatsappPayload = {
  source: 'WhatsApp',
  description: 'O elevador parou e tem gente dentro.',
  buildingId: 'BLD-002',
  equipmentId: 'EQP-1932',
  requester: 'Marina Duarte',
  phone: '(31) 99824-1120',
  passengers: null,
  safetyCondition: '',
  situationCode: '',
  observations: 'Mensagem recebida às 14:32.',
}
const humanInitial = {
  source: 'Atendimento humano',
  description: '',
  buildingId: '',
  equipmentId: '',
  requester: '',
  phone: '',
  passengers: '',
  safetyCondition: '',
  situationCode: '',
  observations: '',
}
const aiInitial = { ...humanInitial, source: 'Assistente de IA' }
const channels = [
  {
    id: 'ai',
    label: 'Assistente de IA',
    description: 'A IA conduz a coleta por perguntas e já prevê o problema.',
  },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Simular dados recebidos automaticamente.' },
  {
    id: 'human',
    label: 'Atendimento humano',
    description: 'Registrar a ligação com perguntas guiadas.',
  },
  { id: 'other', label: 'Outro canal', description: 'Registrar uma entrada operacional genérica.' },
]

function NewIncident() {
  const [channel, setChannel] = useState('ai')
  const [form, setForm] = useState(aiInitial)
  const { buildings } = useBuildings()
  const { equipment } = useEquipment()
  const navigate = useNavigate()
  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const chooseChannel = (next) => {
    setChannel(next)
    setForm(
      next === 'whatsapp'
        ? whatsappPayload
        : next === 'ai'
          ? aiInitial
          : { ...humanInitial, source: next === 'human' ? 'Atendimento humano' : 'Outro canal' }
    )
  }
  const selectedEquipment = equipment.filter(
    (item) => !form.buildingId || item.buildingId === form.buildingId
  )
  // Pendências já calculadas para cada canal (sem processamento nesta simulação).
  const preview = previews[channel] ?? previews.human
  const receivedFields =
    channel === 'whatsapp'
      ? [
          ['Canal', 'WhatsApp'],
          ['Local', buildings.find((item) => item.id === form.buildingId)?.name || 'Não informado'],
          ['Equipamento', form.equipmentId || 'Não informado'],
          ['Descrição', form.description],
          ['Contato', form.phone ? 'Informado' : 'Não informado'],
          ['Horário', '14:32 · dado demonstrativo'],
        ]
      : []
  const submit = (event) => event.preventDefault()

  return (
    <PageContainer
      title="Nova ocorrência"
      description="Escolha a origem. Todos os canais seguem o mesmo fluxo operacional."
    >
      <section className="channel-selector" aria-label="Canal de entrada">
        {channels.map((item) => (
          <button
            key={item.id}
            type="button"
            className={channel === item.id ? 'active' : ''}
            aria-pressed={channel === item.id}
            onClick={() => chooseChannel(item.id)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </section>
      {channel === 'ai' ? (
        // A IA conduz a conversa inteira e, ao final, já cria a ocorrência e leva o
        // operador para a tela dela — sem formulário de revisão por trás.
        <IncidentChatbot />
      ) : (
        <form className="incident-form" onSubmit={submit}>
          {channel === 'whatsapp' ? (
            <Card title="Dados recebidos automaticamente" className="intake-card">
              <div className="received-grid">
                {receivedFields.map(([label, value]) => (
                  <p key={label}>
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </p>
                ))}
              </div>
              <p className="simulation-note">
                Payload simulado para demonstração. Os campos abaixo podem ser complementados pelo
                supervisor.
              </p>
            </Card>
          ) : (
            <section className="form-section">
              <h2>O que o cliente informou?</h2>
              <div className="form-grid">
                <Input
                  label="Solicitante"
                  name="requester"
                  value={form.requester}
                  onChange={update}
                />
                <Input label="Telefone" name="phone" value={form.phone} onChange={update} />
                <label className="ui-field full">
                  <span>Problema relatado</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={update}
                    className="ui-input"
                    rows="4"
                    placeholder="Ex.: O elevador parou e há duas pessoas dentro."
                  />
                </label>
              </div>
            </section>
          )}
          <section className="form-section">
            <h2>{channel === 'whatsapp' ? 'Completar informações' : 'Contexto do atendimento'}</h2>
            <div className="form-grid">
              <Select
                label="Prédio"
                name="buildingId"
                value={form.buildingId}
                onChange={update}
                placeholder="Não informado"
                options={buildings.map((item) => ({ value: item.id, label: item.name }))}
              />
              <Select
                label="Equipamento"
                name="equipmentId"
                value={form.equipmentId}
                onChange={update}
                placeholder="Não informado"
                options={selectedEquipment.map((item) => ({
                  value: item.id,
                  label: `${item.id} · ${item.code}`,
                }))}
              />
              <Input
                label="Passageiros envolvidos"
                type="number"
                min="0"
                name="passengers"
                value={form.passengers}
                onChange={update}
                placeholder="Não informado"
              />
              <Select
                label="Condição de segurança"
                name="safetyCondition"
                value={form.safetyCondition}
                onChange={update}
                placeholder="Não informado"
                options={[
                  { value: 'safe', label: 'Sem risco identificado' },
                  { value: 'passengers_trapped', label: 'Pessoas presas' },
                  { value: 'restricted_area', label: 'Área restrita' },
                ]}
              />
            </div>
          </section>
          <Card title="Informações ainda necessárias" className="missing-preview">
            {preview.missingInformation.length ? (
              <ul className="missing-list">
                {preview.missingInformation.map((item) => (
                  <li key={item.field}>
                    <Badge tone="high">Pendente</Badge> {item.label} não informado
                  </li>
                ))}
              </ul>
            ) : (
              <p>Informações suficientes para classificação inicial.</p>
            )}
          </Card>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => navigate('/incidents')}>
              Cancelar
            </Button>
            <Button type="submit">Classificar ocorrência</Button>
          </div>
        </form>
      )}
    </PageContainer>
  )
}

export default NewIncident
