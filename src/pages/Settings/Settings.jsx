import { useState } from 'react'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import Select from '../../components/ui/Select/Select'
import Input from '../../components/ui/Input/Input'
import Badge from '../../components/ui/Badge/Badge'
import { useTheme } from '../../hooks/useTheme'

const defaultAISettings = { enabled: true, baseUrl: 'http://localhost:11434', model: 'llama3.1' }

function Settings() {
  const [settings, setSettings] = useState({ defaultView: 'control-center', notificationLevel: 'all' })
  const { theme, setTheme } = useTheme()
  const [aiSettings, setAiSettings] = useState(defaultAISettings)
  const [saved, setSaved] = useState(false)
  // Valores fixos da simulação: não há conexão com IA nem sincronização de dados.
  const source = 'local'
  const error = null
  const syncing = false
  const pendingMutations = 0
  const pendingDetails = []
  const lastSyncedAt = null
  const connectionStatus = null
  const testing = false
  const syncMessage = ''
  const testConnection = () => undefined
  const runSync = () => undefined
  const save = (event) => {
    event.preventDefault()
    setSaved(true)
  }
  return (
    <PageContainer title="Configurações" description="Preferências da supervisão operacional.">
      <form className="settings-form" onSubmit={save}>
        <Card title="Preferências">
          <div className="form-grid">
            <Select
              label="Tela inicial"
              value={settings.defaultView}
              onChange={(event) =>
                setSettings((current) => ({ ...current, defaultView: event.target.value }))
              }
              options={[
                { value: 'control-center', label: 'Centro de Controle' },
                { value: 'incidents', label: 'Ocorrências' },
              ]}
            />
            <Select
              label="Notificações"
              value={settings.notificationLevel}
              onChange={(event) =>
                setSettings((current) => ({ ...current, notificationLevel: event.target.value }))
              }
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'critical', label: 'Apenas críticas' },
              ]}
            />
            <Select
              label="Tema visual"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              options={[
                { value: 'light', label: 'Claro' },
                { value: 'dark', label: 'Escuro' },
              ]}
            />
          </div>
          <div className="form-actions">
            <Button type="submit">Salvar preferências</Button>
          </div>
          {saved && <p className="form-hint">Preferências salvas neste navegador.</p>}
        </Card>
      </form>
      <Card title="Inteligência Artificial (Ollama)" className="ai-settings">
        <p className="simulation-note">
          O Insight de IA e o assistente de nova ocorrência rodam via chamadas HTTP diretas do
          navegador para um Ollama local — sem backend. Rode o Ollama na sua máquina e permita
          requisições do navegador (variável <code>OLLAMA_ORIGINS=*</code>) para habilitar.
        </p>
        <div className="form-grid">
          <Select
            label="IA habilitada"
            value={aiSettings.enabled ? 'on' : 'off'}
            onChange={(event) =>
              setAiSettings((current) => ({ ...current, enabled: event.target.value === 'on' }))
            }
            options={[
              { value: 'on', label: 'Sim, usar Ollama quando disponível' },
              { value: 'off', label: 'Não, usar apenas análise de padrões local' },
            ]}
          />
          <Input
            label="URL do Ollama"
            value={aiSettings.baseUrl}
            onChange={(event) =>
              setAiSettings((current) => ({ ...current, baseUrl: event.target.value }))
            }
            placeholder="http://localhost:11434"
          />
          <Input
            label="Modelo"
            value={aiSettings.model}
            onChange={(event) =>
              setAiSettings((current) => ({ ...current, model: event.target.value }))
            }
            placeholder="llama3.1"
          />
        </div>
        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={testConnection} disabled={testing}>
            {testing ? 'Testando…' : 'Testar conexão'}
          </Button>
        </div>
        {connectionStatus && (
          <p className={`form-hint ${connectionStatus.ok ? '' : 'form-hint--error'}`}>
            {connectionStatus.ok
              ? `Conectado. Modelos disponíveis: ${connectionStatus.models.join(', ') || 'nenhum listado'}.`
              : `Não foi possível conectar: ${connectionStatus.error}`}
          </p>
        )}
      </Card>
      <Card title="Fonte de dados" className="datasource">
        <div className="datasource-status">
          <p>
            <strong>Origem atual:</strong> {source}
          </p>
          <Badge tone={pendingMutations > 0 ? 'high' : 'neutral'}>
            {pendingMutations > 0
              ? `${pendingMutations} alteração(ões) pendente(s) de sincronização`
              : 'Tudo sincronizado'}
          </Badge>
          <p>
            <strong>Última sincronização:</strong>{' '}
            {lastSyncedAt ? lastSyncedAt.replace('T', ' ').slice(0, 16) : 'Nunca sincronizado'}
          </p>
        </div>
        {pendingDetails.length > 0 && (
          <ul className="plan-list">
            {pendingDetails.map((item) => (
              <li key={item.id}>
                {item.method} {item.resource} · {item.createdAt.replace('T', ' ').slice(0, 16)}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="form-hint form-hint--error">{error.message}</p>}
        <div className="form-actions">
          <Button type="button" onClick={runSync} disabled={syncing}>
            {syncing ? 'Sincronizando…' : 'Sincronizar agora'}
          </Button>
        </div>
        {syncMessage && <p className="form-hint">{syncMessage}</p>}
        <p className="simulation-note">
          Quando a fonte de dados for a API (VITE_DATA_SOURCE=api), as alterações feitas offline
          ficam nesta fila e são enviadas ao sincronizar; com dados locais, esta seção fica
          informativa.
        </p>
      </Card>
    </PageContainer>
  )
}
export default Settings
