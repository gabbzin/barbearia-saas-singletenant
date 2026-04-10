# Roadmap de Features (v1.8)

## Status atualizado

- v1.7 foi antecipada.
- Refatoração parcial do dashboard do barbeiro foi entregue.
- Landing page foi atualizada.
- Pendente identificado: linha do tempo do dia atual no dashboard do barbeiro.

## Objetivo da v1.8

Finalizar a refatoração do dashboard do barbeiro com foco na experiência operacional do dia, implementando a linha do tempo de hoje com dados confiáveis, leitura rápida e boa responsividade.

## Escopo da v1.8

- Implementar linha do tempo do dia de hoje no dashboard do barbeiro.
- Exibir os agendamentos do dia em ordem cronológica.
- Destacar visualmente horário atual, próximos atendimentos e concluídos/cancelados.
- Garantir comportamento responsivo para desktop e mobile.
- Manter consistência visual com a nova landing e com os padrões atuais do sistema.

## Critérios de aceite

- O barbeiro consegue visualizar todos os agendamentos do dia atual em uma linha do tempo única.
- A ordenação por horário está correta e estável.
- Estados relevantes do agendamento ficam claros na interface.
- Em telas menores, a linha do tempo continua legível e utilizável.
- A tela carrega sem regressões no restante do dashboard.

## Checklist de execução

### Fase 1 - Estrutura da timeline

- [ ] Definir estrutura visual e componentes reutilizáveis da linha do tempo.
- [ ] Integrar seção da timeline na página principal do dashboard do barbeiro.

### Fase 2 - Dados do dia atual

- [ ] Garantir query/ação para buscar agendamentos do dia atual do barbeiro logado.
- [ ] Validar timezone e corte correto de início/fim do dia.
- [ ] Ordenar dados por horário de forma determinística.

### Fase 3 - Regras visuais e estados

- [ ] Destacar slot atual e próximos horários.
- [ ] Exibir status do agendamento com variações visuais consistentes.
- [ ] Tratar estado vazio (sem agendamentos hoje).

### Fase 4 - Qualidade e validação

- [ ] Validar responsividade da timeline em mobile e desktop.
- [ ] Revisar consistência com o restante do dashboard.
- [ ] Executar testes manuais do fluxo diário do barbeiro.

## Fora de escopo da v1.8

- Novas mudanças estruturais de banco para agendamento.
- Alterações de escopo em checkout/pagamentos.
- Nova refatoração ampla da landing page.
