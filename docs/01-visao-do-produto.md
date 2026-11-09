# Visão do produto

## O que é o Vozly

O Vozly é uma solução de agentes de voz inteligentes para automatizar atendimentos e operações empresariais por telefone. Seus agentes conversam naturalmente com clientes, consultam informações autorizadas e executam operações definidas pela empresa por meio de integrações controladas.

**Posicionamento:** Solução de agentes de voz inteligentes para automatizar atendimentos e operações empresariais.

**Promessa:** transformar chamadas telefônicas em atendimentos resolutivos, com conversas naturais, acesso controlado às informações e execução rastreável de operações, mantendo a possibilidade de transferência para uma pessoa.

## Problema

Empresas recebem chamadas repetitivas para consultar informações, acompanhar solicitações e iniciar atendimentos. Essas interações consomem o tempo das equipes, podem ficar sem resposta fora do horário de funcionamento e dependem de informações que muitas vezes estão distribuídas entre pessoas, documentos e sistemas.

## Mercado inicial e expansão

O primeiro segmento de validação será o de assistências técnicas de eletrodomésticos, incluindo operações realizadas na loja e em domicílio. Esse contexto permite validar necessidades concretas, como responder dúvidas recorrentes, consultar ordens de serviço e registrar solicitações de atendimento.

A escolha representa uma estratégia de entrada e validação. A evolução do Vozly poderá atender outros segmentos empresariais quando houver casos de uso, integrações e regras de negócio bem compreendidos.

## Usuários

- **Administrador da empresa:** configura agentes, usuários, permissões, informações e operações autorizadas.
- **Operador/atendente:** acompanha atendimentos e assume conversas transferidas.
- **Cliente que liga:** interage por telefone com o agente de voz.
- **Administrador Vozly:** opera o serviço e presta suporte com acesso controlado.

## Princípios

- Conversas naturais e objetivas, adequadas ao contexto da empresa.
- Configuração acessível para pessoas não técnicas.
- Ações limitadas a operações explicitamente autorizadas.
- Respostas operacionais fundamentadas em fontes confiáveis.
- Transparência sobre o atendimento automatizado.
- Transferência humana quando necessária.
- Histórico, auditoria e rastreabilidade.
- Proteção dos dados e isolamento entre empresas.

## Jornada principal

1. A empresa configura seu ambiente e usuários.
2. Define o agente, sua identidade, instruções e regras.
3. Cadastra informações aprovadas para consulta.
4. Habilita operações que o agente pode solicitar.
5. Configura horários, números e regras de transferência.
6. Testa e publica uma versão do agente.
7. O agente recebe chamadas e atende dentro das permissões publicadas.
8. A empresa acompanha chamadas, resultados, transferências e consumo.

## Métricas

Chamadas atendidas, resolvidas e transferidas; solicitações registradas; consultas concluídas; duração média; falhas por etapa; custo estimado por chamada/minuto; satisfação quando houver coleta válida. Uma transferência correta também pode representar um resultado bem-sucedido.

## Limites e princípios de segurança

O agente não deve inventar informações, status, preços, prazos, disponibilidade ou confirmações. A IA interpreta a conversa e solicita operações; o backend valida identidade, tenant, permissões, dados e regras de negócio antes de executar qualquer ação.

O Vozly não tem como objetivo substituir integralmente equipes humanas. O atendimento humano permanece parte do fluxo, especialmente em situações ambíguas, sensíveis, excepcionais ou não suportadas.
