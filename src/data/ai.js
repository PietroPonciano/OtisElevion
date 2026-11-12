// Textos fixos que simulam as respostas da IA (nenhuma chamada é feita).
export const insight = {
  probableCause: 'Falha no sensor da porta de cabine, que impede o fechamento e para o elevador no andar.',
  confidence: 'alta',
  suggestedPart: 'Sensor de porta de cabine e cabo de conexão',
  suggestedAction:
    'Limpar e testar o sensor; se a falha continuar, substituir a peça e registrar o teste de fechamento.',
  patternsFound: [
    '3 chamadas parecidas nos últimos 30 dias',
    'Todas ocorreram em horários de maior movimento',
  ],
  pastResolutionSummary:
    'Nas duas últimas vezes, a troca do sensor da porta resolveu o problema em menos de uma hora.',
}
export const chatMessages = [
  ['bot', 'Olá! Vou te ajudar a registrar a ocorrência. Qual é o local?'],
  ['user', 'Edifício Central'],
  ['bot', 'Qual equipamento apresenta o problema?'],
  ['user', 'EQP-2841 · Elevador A'],
  ['bot', 'Há pessoas dentro do equipamento?'],
  ['user', 'Não'],
  ['bot', 'Conte com suas palavras o que aconteceu.'],
  ['user', 'A porta não fecha direito e o elevador fica parado no andar.'],
  ['bot', 'Marque os sintomas que se aplicam.'],
  ['user', 'Porta'],
  ['bot', 'Perfeito, deixa eu analisar o histórico desse equipamento…'],
  ['bot', 'Encontrei um padrão no histórico deste equipamento — veja o que descobri:'],
]
export const traceSteps = [
  ['Lendo o cadastro', 'EQP-2841 · Elevador em Edifício Central'],
  ['Interpretando o relato', '"A porta não fecha direito e o elevador fica parado no andar." → Porta'],
  ['Classificando a ocorrência', 'Porta · ninguém dentro'],
  ['Cruzando com o histórico deste equipamento', 'Buscando falhas parecidas e como cada uma foi resolvida'],
  ['Montando a previsão', 'Causa mais provável: falha no sensor da porta de cabine'],
]
