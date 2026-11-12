# OtisOps: versão de simulação (React)

Mesmas telas e mesmo visual do projeto original, mas estáticas: sem IA, sem Ollama, sem API,
sem localStorage e sem regras de negócio. Os botões de ação não alteram dados.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

## Estrutura

```
src/
  app/          rotas (AppRoutes) e raiz do app
  pages/        uma pasta por tela
  components/   componentes reutilizáveis (layout, ui, incidents, decision, ai...)
  styles/       CSS global (idêntico ao original)
  data/         dados fixos
    snapshot.json  resultado já calculado (fila, SLA, decisões, indicadores, histórico)
    ai.js          textos fixos que simulam as respostas da IA
    static.js      ponto único de acesso aos dados
  hooks/        hooks de uma linha que devolvem os dados fixos
  constants/ utils/ context/ engine/incidentWorkflow.js
```

## Observações

- Data de referência fixa: 26/08/2026 às 10:30. Todos os prazos (SLA) são calculados a
  partir dela, por isso a tela não muda com o passar do tempo.
- O texto da IA (Insight da IA e Assistente de nova ocorrência) é o mesmo em todas as ocorrências.
