# Requisitos do MVP

## Objetivo

Entregar uma primeira versão validável em uma empresa piloto: configurar e publicar um agente de voz, receber chamadas, responder com informações aprovadas, executar operações autorizadas e disponibilizar histórico rastreável. Simulações devem ser identificadas como simulações.

O primeiro cenário de validação será uma assistência técnica de eletrodomésticos. O escopo funcional detalhado está em [06 — Escopo funcional do primeiro agente](06-escopo-funcional-primeiro-agente.md).

## MVP-01 — Conta e empresa

- Cadastro e autenticação.
- Criação de ambiente empresarial (tenant).
- Memberships e papéis OWNER, ADMIN e OPERATOR.
- Recuperação de acesso.
- Autorização sempre no contexto do tenant.

**Aceite:** usuário não acessa dados de outro tenant alterando IDs; papéis limitam ações administrativas; o servidor associa recursos ao tenant autorizado.

## MVP-02 — Configuração guiada

- Nome do agente e da empresa.
- Idioma inicial: português brasileiro.
- Tom, estilo e instruções.
- Mensagem inicial e encerramento.
- Horários e regras de fallback.
- Salvar rascunho, testar e publicar versões identificáveis.

**Aceite:** alterações não afetam produção até nova publicação; cada chamada referencia a versão utilizada.

## MVP-03 — Conhecimento

- Cadastro e edição de informações da empresa, serviços e perguntas frequentes.
- Ativação/desativação de conteúdo.
- Associação do conteúdo a um agente.
- Respostas fundamentadas no conteúdo disponível e aprovado.

Upload e processamento de PDF podem vir após validar conteúdo estruturado.

**Aceite:** conteúdo de um tenant nunca aparece para outro; sem informação suficiente, o agente admite a limitação e segue o fallback; respostas não podem extrapolar o conteúdo disponível.

## MVP-04 — Operações autorizadas

As operações funcionais do primeiro agente são:

1. Atendimento e consulta de informações aprovadas.
2. Consulta de ordem de serviço por integração autorizada, com validação do solicitante.
3. Abertura de solicitação de atendimento, com validação dos dados e confirmação do backend.

Transferência para atendimento humano deve estar disponível como mecanismo transversal.

**Aceite:** backend valida schema, tenant, permissão e regra de negócio; registra auditoria; devolve resultado real; falhas não são apresentadas como sucesso. O LLM não executa SQL nem acessa sistemas internos diretamente.

## MVP-05 — Telefonia e voz

- Receber chamadas por provedor compatível.
- Associar número, tenant e agente.
- Gerenciar sessões e estados de chamada.
- Integrar reconhecimento de fala (STT), modelo de linguagem (LLM) e síntese de voz (TTS).
- Tratar desconexões, timeouts e falhas.
- Transferir chamadas quando configurado.

Fornecedores ainda serão selecionados e encapsulados por adaptadores.

## MVP-06 — Histórico

Listar chamadas por período/agente; exibir data, duração, status, resultado, transcrição permitida, ferramentas executadas, transferências e falhas. Gravação de áudio não é presumida: finalidade, aviso, acesso e retenção precisam de definição.

## MVP-07 — Consumo

Registrar duração e consumo por tenant, uso de fornecedores e preparar limites por plano.

## Requisitos não funcionais

- **Segurança:** isolamento multi-tenant no backend, autorização por papel, segredos protegidos, criptografia em trânsito e rate limiting.
- **Confiabilidade:** timeouts, tratamento de indisponibilidade, idempotência, persistência do estado e monitoramento.
- **LGPD:** finalidade/base legal, transparência, minimização, retenção, exclusão, acesso restrito e mapeamento de subprocessadores.
- **UX:** configuração clara, feedback de salvamento/publicação, estados vazios e mensagens úteis.
- **Rastreabilidade:** chamadas, versões do agente, operações solicitadas, resultados e transferências devem ser correlacionáveis.

## Fluxo prioritário

1. Cliente liga.
2. Provedor encaminha a chamada.
3. Vozly identifica tenant, agente e versão publicada.
4. Agente identifica a necessidade do cliente.
5. Consulta o conhecimento ou solicita uma operação autorizada.
6. Backend valida e executa a operação.
7. Agente comunica somente o resultado real retornado.
8. Aplica fallback ou transfere se necessário.
9. Persiste eventos, transcrição permitida e resumo.

## Regras essenciais

- O agente só opera quando publicado e ativo.
- O agente só utiliza ferramentas habilitadas para sua versão e tenant.
- A intenção ou sugestão do modelo não autoriza a execução.
- O backend é responsável por validar autorização, dados e regras de negócio.
- Nunca inventar preço, disponibilidade, status, prazo, protocolo ou confirmação.
- Nunca declarar uma operação concluída antes da confirmação do sistema responsável.
- Transferência respeita regras configuradas e preserva o contexto necessário.
- Alterações e operações são rastreáveis.

## Fora do MVP

- Agendamento e confirmação de visitas com consulta de disponibilidade de técnicos.
- Cancelamento ou reagendamento de visitas.
- Orçamentos, negociação de preços e pagamentos.
- Integrações profundas com ERPs ou sistemas de fabricantes antes de conhecer o sistema e o fluxo do piloto.
- Construtor visual complexo, marketplace de integrações, chamadas ativas em massa, WhatsApp, cobrança recorrente completa, relatórios avançados e múltiplos idiomas.

Esses itens poderão ser avaliados após validação das operações iniciais.

## Perguntas em aberto

- Provedor de telefonia e estratégia de conexão.
- Combinação STT/LLM/TTS.
- Gravação de áudio versus transcrição e respectivas políticas.
- Sistema utilizado pelo piloto para ordens de serviço e abertura de solicitações.
- Dados e método de validação da identidade do solicitante.
- Destino, horário e regras da transferência humana.
- Limites de duração, concorrência e consumo.
