# ADR-001: Geração Dinâmica de Slots de Agendamento

**Status:** Aceito
**Data:** 14 de Maio de 2026

## 1. Contexto

O sistema de agendamentos (booking) da barbearia necessita lidar com uma alta complexidade na definição e disponibilização de horários. Especificamente, o cálculo de disponibilidade precisa ser extremamente flexível e levar em consideração os seguintes fatores que mudam constantemente:
- **Serviços Variáveis:** Cada serviço ou combinação de serviços possui durações distintas.
- **Intervalos (Breaks):** Pausas para almoço ou descanso dos profissionais que podem variar.
- **Exceções (Time Off/Holidays):** Feriados, férias ou ausências não planejadas dos barbeiros.
- **Agendamentos Existentes (Bookings):** Horários já ocupados que afetam o espaço disponível restante no dia.

Uma abordagem tradicional seria pré-calcular e persistir "slots" (espaços de tempo) no banco de dados. No entanto, qualquer mudança na configuração de um barbeiro ou cancelamento de agendamento exigiria uma cascata de atualizações no banco de dados para recalcular os slots futuros.

## 2. Decisão

**Os slots de horário não serão persistidos no banco de dados.** 

Toda a disponibilidade de horários (`getDateAvailableTimeSlots`) será calculada **dinamicamente** em tempo de execução, sempre que o cliente ou a aplicação solicitar os horários disponíveis para uma determinada data. O sistema irá buscar as regras base (expediente, exceções, agendamentos já feitos, duração dos serviços) e o algoritmo em memória montará os horários livres.

## 3. Consequências

### Positivas
- **Alta Flexibilidade:** Mudanças nas configurações de horário do barbeiro (ex: aumentar o tempo de almoço) refletem imediatamente na disponibilidade sem necessidade de scripts de migração ou atualização de dados.
- **Menor Inconsistência:** Elimina o risco de "slots fantasmas" ou dados dessincronizados no banco de dados. A fonte da verdade são apenas as configurações e os agendamentos reais (bookings).
- **Suporte a Regras Complexas:** Facilita a implementação de lógicas complexas, como tempo de preparo entre cortes (padding) ou sobreposição condicional, já que tudo é resolvido via código (algoritmo) e não via queries complexas de banco.

### Negativas
- **Maior Custo Computacional (Performance):** Calcular a disponibilidade sob demanda exige maior processamento de CPU no backend a cada requisição de calendário. Em cenários de altíssimo tráfego, isso pode se tornar um gargalo, podendo exigir estratégias futuras de mitigação (como cache de curta duração no Redis).